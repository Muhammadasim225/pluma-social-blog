const { GraphQLISODateTime } = require('graphql-iso-date');
const bcrypt=require('bcrypt');
const prisma=require('../DB/db.config')
const jwt=require('jsonwebtoken')
const { DateTimeResolver } = require('graphql-scalars');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const cloudinary=require('../utils/cloudinary');
const { use } = require('passport');
const differenceInHours=require('date-fns');
const { post } = require('../auth');


const resolvers={
    DateTime: DateTimeResolver,

    Query:{

        // Get all Users
       users:async()=>{
        try{
            const users=await prisma.user.findMany({
                include:{
                    posts:true,
                    followers: {
                      include: {
                        follower: true  // or the correct nested user reference
                      }
                    }                }
            })
            return users.map((user)=>({
                ...user,
                posts:user.posts.map((post)=>({
                    title: post.title,
                    description: post.description,
                    userId: post.userId,
                    full_name: user.full_name
                })),
                followers:user.followers.map((foll)=>({
                  full_name: foll.follower.full_name, // ✅ Corrected this line
                }))

              


            }))
        }
        catch(err){
            console.error("Error try again",err);

        }
       },
       // Get Blog Posts by ID
       post:async(_,{addId},context)=>{
        const loggedInUserId = context.id;
        
        if (!loggedInUserId) {
          throw new Error("You must be logged in");
        }
        
        console.log("The loggedInUserId is:- ",loggedInUserId);
      
        const findById=await prisma.post.findUnique({
            where:{
                id:addId.id
            },
            include: {
              user: {
                include: {
                  profile: true,
                  followers: {
                    include: {
                      follower: true, // Important
                    },
                  },
                },
              },
              tags: true,
              comments: {
                include: {
                  user: true,
                },
              },
            },
          });
        console.log("The find By Id is:-",findById);
        if(!findById){
          console.log("When the find By Id is incorrect:-",findById);
            throw new Error("Id does'nt exists")
        }
        else{
          const updatePostTable=await prisma.post.update({
            where:{
              id:addId.id
            },
            data:{
              views:{
                increment:1
              }

            }
          })
          console.log("The updatePost table is:-",updatePostTable);

        }
        return findById;
     
      
    },
       // Get User By ID 
       user:async(_,__,{id})=>{
        if(!id){
          console.log(id)
          throw new Error("You must be logged in")
      }
      try{
        const findById=await prisma.user.findUnique({
            where:{
                id:id
            },
            include:{
                posts:true,
                profile:true
            }
        })
        console.log("THe find by Id is:-", findById);
        if(!findById){
            throw new Error("Id does'nt exists")
        }
       
        return findById
      }
      catch(err) {
        console.error("Error on fetch user by Id", err.message);
        throw new Error(err.message);
      }
    },
       // Get All Blog Posts without user logs in..
       posts:async()=>{
      //   if(!id){
      //     console.log(id)
      //     throw new Error("You must be logged in")
      // }
        try{
            const posts=await prisma.post.findMany({
              orderBy: {
                createdAt: 'desc', // 🔽 Sort by latest posts
              },
                include:{
                    user:true,
                    tags:true,
                },

            })
            const postWithReadTime = posts.map((abc) => {
              const description = abc.description || '';
              const wordCount = description.trim().split(/\s+/).length;
              console.log('Post:', abc.title, 'Words:', wordCount);
              const readTime = Math.ceil(wordCount / 200);
              console.log("The read time is",readTime);
              return {
                ...abc,
                readTime:readTime
              };
            });
        
            return postWithReadTime;
                     
        }
        catch(err) {
            console.error("Error on fetch all posts", err.message);
            throw new Error(err.message);
          }

    },
    // Fetch All Blog Post but latest show first 
    getAllBlogPostByLatestSort:async(_,{id})=>{
        if(!id){
            throw new Error("You must be logged in")
        }
        try{
            const getAllPost=await prisma.post.findMany({
                orderBy:{
                    createdAt:'desc'
                },
            })
            return getAllPost
        }
        catch(err) {
            console.error("Error on fetch all latest posts with sorting", err.message);
            throw new Error(err.message);
          }
    },
    // Fetch Post By User Id
    getPostByUserId:async(_,{id})=>{
        if(!id){
            throw new Error("You must be logged in")
        }
        try{
            const findPost=await prisma.post.findMany({
                where:{
                    userId:id
                },
                include:{
                    user:true,
                    tags:true
                }
            })

            return findPost

        }
        catch(err) {
            console.error("Error on fetch single posts By User-Id", err.message);
            throw new Error(err.message);
          }       
    },
    // Delete single Blog Post by ID
    deletePost: async (_, { id }) => {
      try {
        // 1. Fetch the post and its tags
        const postWithTags = await prisma.post.findUnique({
          where: { id },
          include: { tags: true },
        });
    
        if (!postWithTags) {
          throw new Error("Post not found");
        }
    
        // 2. Delete related comments
        await prisma.comment.deleteMany({
          where: { postId: id },
        });
    
        // ✅ 3. Delete related likes
        await prisma.like.deleteMany({
          where: { postId: id },
        });
    
        // 4. Delete the post
        await prisma.post.delete({
          where: { id },
        });
    
        // 5. Clean up unused tags
        for (const tag of postWithTags.tags) {
          const tagStillUsed = await prisma.post.findFirst({
            where: {
              tags: { some: { id: tag.id } },
            },
          });
    
          if (!tagStillUsed) {
            await prisma.tag.delete({ where: { id: tag.id } });
          }
        }
    
        return postWithTags;
      } catch (err) {
        console.error("Error deleting post:", err.message);
        throw new Error("Failed to delete post: " + err.message);
      }
    },    
      
    // Fetch All Tags
    tags:async()=>{
        try{
            const kkk=await prisma.tag.findMany({})
            return kkk
        }
        catch(err) {
            console.error("Error on fetch all tags", err.message);
            throw new Error(err.message);
          }

    },
    //Fetch Tag By Id
    tag:async(_,{id})=>{
    
        try{
            const findById=await prisma.tag.findUnique({
                where:{id},
            })
            return findById

        }
        catch(err) {
            console.error("Error on fetching single tag", err.message);
            throw new Error(err.message);
          }
    },
    // Fetch tags from user Id
    getTagByUserId:async(_,{id})=>{
        try {
            const tags = await prisma.tag.findMany({
              where: { userId: id },
              include: {
                user: true, // If you want to return the user info inside the tag
              },
            });
            return tags;
    }
    catch(err) {
        console.error("Error on fetching single tag from userId", err.message);
        throw new Error(err.message);
      }
    },
    // Fetch All other user's Blog Post
    getTargetBlogPostsOthers: async (_, { id }, context) => {
      const loggedInUserId = context.id;
    
      if (!loggedInUserId) {
        throw new Error("You must be logged in");
      }
    
      if (loggedInUserId === id) {
        throw new Error("You cannot fetch your own posts using this query");
      }
    
      try {
        const posts = await prisma.post.findMany({
          where: {
            userId: id
          },
          include: {
            user: true,
            tags: true
          }
        });
    
        return posts;
      } catch (err) {
        console.error("Error fetching posts of other user:", err.message);
        throw new Error("Something went wrong while fetching posts");
      }
    },
    getAllOtherUserBlogPost:async(_, __, context)=>{
      const { id } = context;

      if (!id) {
        throw new Error("You must be logged in");
      }
      try {
        const posts = await prisma.post.findMany({
          where: {
            userId: {
              not: id
            }
          },
          include: {
            user: true,
            tags: true
          }
        });
    
        return posts;
      }
catch (err) {
  console.error("Error fetching posts of all other user:", err.message);
  throw new Error("Something went wrong while fetching posts");
}
    },
    getOurFollowerCount: async (_, __,{ id }) => {
      if (!id) {
        throw new Error("You must be logged in");
      }
    
      try {
        const findAndCountFollower = await prisma.follow.count({
          where: {
            followingId: id, 
          },
        });
      
        return findAndCountFollower;
      } catch (err) {
        console.error("Error on counting of followers:", err.message);
        throw new Error("Something went wrong while counting followers");
      }
    },
    getOurFollowingCount: async (_, __,{ id }) => {
      if (!id) {
        throw new Error("You must be logged in");
      }
    
      try {
        const findAndCountFollowing = await prisma.follow.count({
          where: {
            followerId: id, 
          },
        });
      
    
        return findAndCountFollowing;
      } catch (err) {
        console.error("Error on counting of following:", err.message);
        throw new Error("Something went wrong while counting followings");
      }
    },
    getOwnPostCount:async(_,__,{id})=>{
      if (!id) {
        throw new Error("You must be logged in");
      }
      try{
        const countPost=await prisma.post.count({
          where:{
            userId:id
          }
        })
        return countPost

      }
      catch (err) {
        console.error("Error on counting of our posts:", err.message);
        throw new Error("Something went wrong while counting of our posts");
      }
    },
    getOtherFollowerCount:async(_,__,{id})=>{

      if (!id) {
        throw new Error("You must be logged in");
      }

      try{
        const findAndCountFollower = await prisma.follow.count({
          where: {
            followingId:{
              not:id
            } 
          },
        });  

        return findAndCountFollower
      }
      catch (err) {
        console.error("Error on counting of other's followers count:", err.message);
        throw new Error("Something went wrong while counting of others followers");
      }

    },
    getOtherFollowingCount:async(_,__,{id})=>{

      if (!id) {
        throw new Error("You must be logged in");
      }

      try{
        const findAndCountFollowing = await prisma.follow.count({
          where: {
            followerId:{
              not:id
            } 
          },
        });  

        return findAndCountFollowing
      }
      catch (err) {
        console.error("Error on counting of other's following count:", err.message);
        throw new Error("Something went wrong while counting of others following");
      }

    },
    getOtherPostCount:async(_,__,{id})=>{
      if (!id) {
        throw new Error("You must be logged in");
      }
      try{
        const countPost=await prisma.post.count({
          where:{
            userId:{
              not:id
            }
          }
        })
        return countPost

      }
      catch (err) {
        console.error("Error on counting others posts:", err.message);
        throw new Error("Something went wrong while counting of others posts");
      }
    },
    getSingleFollowerCount: async (_, { id: targetUserId }, context) => {
      const loggedInUserId = context.id;
    
      if (!loggedInUserId) {
        throw new Error("You must be logged in");
      }
    
      try {
        const count = await prisma.follow.count({
          where: {
            followingId: {
              not:id
            } 
          },
        });
    
        return count;
      } catch (err) {
        console.error("Error on counting followers for another user:", err.message);
        throw new Error("Something went wrong while counting followers");
      }
    },
    getSingleFollowingCount: async (_, { id: targetUserId }, context) => {
      const loggedInUserId = context.id;
    
      if (!loggedInUserId) {
        throw new Error("You must be logged in");
      }
    
      try {
        const count = await prisma.follow.count({
          where: {
            followerId: targetUserId, 
          },
        });
    
        return count;
      } catch (err) {
        console.error("Error on counting following for another user:", err.message);
        throw new Error("Something went wrong while counting followings");
      }
    },
    getSinglePostCount: async (_, { id: targetUserId }, context) => {
      const loggedInUserId = context.id;
    
      if (!loggedInUserId) {
        throw new Error("You must be logged in");
      }
    
      try {
        const countPost=await prisma.post.count({
          where:{
            userId:targetUserId
            }
        })
        return countPost

      } catch (err) {
        console.error("Error on counting other single person's posts", err.message);
        throw new Error("Something went wrong while counting other single person post ");
      }
    },
    getFollowingUserPosts: async (_, __, { id }) => {
      if (!id) {
        throw new Error("You must be logged in");
      }
    
      try {
        // Step 1: Find all users you're following
        const following = await prisma.follow.findMany({
          where: {
            followerId: id, // You are the follower
          },
          select: {
            followingId: true, // IDs of users you are following
          },
        });

        console.log("The following is:- ",following);
        // Step 2: Extract just the IDs into an array
        const followingIds = following.map((f) => f.followingId);
        console.log("The following ID's is:- ",followingIds);
    
        // Step 3: Find all posts from those users
        const posts = await prisma.post.findMany({
          where: {
            userId: {
              in: followingIds, // only posts from users you're following
            },
          },
          include: {
            user: true,
            tags: true,
            comments: true,
          },
        });
        console.log("The posts is:- ",posts);
    
        return posts;
      } catch (err) {
        console.error("Error fetching posts of following users:", err.message);
        throw new Error("Something went wrong while fetching following users' posts");
      }
    },

    searchArticles:async(_,{querying},{id})=>{
      if (!id) {
        throw new Error("You must be logged in");
      }

      try{
        const posts=await prisma.post.findMany({
          where:{
            OR:[
              {title:{contains:querying,mode:'insensitive'}},
              {description:{contains:querying,mode:'insensitive'}},
            
              {
                tags: {
                  some: {
                    text: { contains: querying, mode: 'insensitive' }
                  }
                }
              } 
            ]
          },
          include:{
            user:true,
            tags:true,
          },
          orderBy: {
            createdAt: 'desc'
          }
        })
        
        const results = posts.map(post => ({
          title: post.title,
          description: post.description,
          cover_img: post.cover_img,
          full_name: post.user.full_name,
          tags: post.tags,
          createdAt: post.createdAt,
          readTime: posts.readTime, 
          likesCount: post.likesCount, 
          commentCount: post.commentCount
        }));

        return results;

      }
      catch(err){
        throw new Error("Error on filtering the search results...")

      }

    },
        // GET other single user by ID
        getOtherSingleUser: async (_, { insertId }, context) => {
          const { id } = insertId;
          const loggedInUserId = context.id;
        
          try {
            const usex = await prisma.user.findUnique({
              where: { id },
              include: {
                posts: {
                  include: {
                    tags: true,
                  },
                },
                profile: true,
                followers: {
                  include: {
                    follower: true,
                  },
                },
                following: {
                  include: {
                    following: true,
                  },
                },
              },
            });
        
            if (!usex) {
              throw new Error("User not found");
            }
        
            // Filter out broken references
            const safeFollowers = usex.followers.filter(f => f.follower !== null);
            const safeFollowing = usex.following.filter(f => f.following !== null);
        
            return {
              ...usex,
              followers: safeFollowers, // ⚠️ Keep full Follow object
              following: safeFollowing, // ⚠️ Keep full Follow object
              followerCount: safeFollowers.length,
              followingCount: safeFollowing.length,
              postCount: usex.posts.length,
            };
          } catch (err) {
            console.error("Error fetching user:", err);
            throw new Error("Internal server error");
          }
        },        
        searchPosts:async(_,{keywords})=>{
          try{
            const findPost=await prisma.post.findMany({
              where:{
                OR:[
                  {title:{contains:keywords,mode:'insensitive'}},
                  {description:{contains:keywords,mode:'insensitive'}},
                  {tags: {
                    some: {
                      text: {
                        contains: keywords,
                        mode: 'insensitive'
                      }
                    }
                  }}
                ]
              },
              include:{
                user:true,
                tags:true
              }
            })
            return findPost
          }
          catch (err) {
            throw new Error(err.message);
          }
        },
        getRelatedBlogPosts: async (_, { addRelatedId }, context) => {
          const loggedInUserId = context.id;
        
          if (!loggedInUserId) {
            throw new Error("You must be logged in");
          }
        
          console.log("🟢 Logged-in user ID:", loggedInUserId);
          console.log("🔎 Post ID received:", addRelatedId);
        
          try {
            const currentPost = await prisma.post.findUnique({
              where: { id: addRelatedId.id },
              include: { tags: true },
            });
        
            console.log("📄 Found current post:", currentPost);
        
            if (!currentPost) {
              throw new Error("Post not found");
            }
        
            const tagIds = currentPost.tags.map(tag => tag.id);
            console.log("🏷️ Tag IDs from current post:", tagIds);
        
            if (tagIds.length === 0) {
              console.log("⚠️ No tags found for current post");
              return [];
            }
        
            const relatedPosts = await prisma.post.findMany({
              where: {
                id: { not: addRelatedId.id },
                tags: {
                  some: {
                    id: { in: tagIds }
                  }
                }
              },
              take: 5,
              include: {
                user: true,
                tags: true,
                likes: true,
                comments: true,
                  user:{
                    include:{
                      profile:true
                    }
                  },
                  tags:true,
                  comments:{
                    include: {
                      user: true
                    }
                  }
              }
            });
        
            console.log("✅ Related posts found:", relatedPosts.length);
            return relatedPosts;
        
          } catch (error) {
            console.error("❌ Error in getRelatedBlogPosts:", error);
            throw new Error("Failed to fetch related posts");
          }
        },
        getTrendingPosts: async () => {
        
          try {
            // Fetch recent published posts (limit 50 for performance)
            const posts = await prisma.post.findMany({
              where: {
                published: true,
                createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // last 7 days
                OR: [
                  { views: { gt: 100 } },
                  { likesCount: { gt: 20 } },
                  { commentCount: { gt: 5 } }
                ]
              },
            });
        
            const now = Date.now();
        
            // Calculate trending score for each post
            const postsWithScores = posts.map(post => {
              const hoursSincePost = Math.max((now - post.createdAt.getTime()) / (1000 * 60 * 60), 1);
        
              const score =
                (post.views * 0.3 +
                  post.likesCount * 0.4 +
                  post.commentCount * 0.3) / hoursSincePost;
        
              return {
                ...post,
                trendingScore: score,
              };
            });
        
            // Sort by trending score descending
            postsWithScores.sort((a, b) => b.trendingScore - a.trendingScore);
        
            // Return top 7 trending posts
            return postsWithScores.slice(0, 6);
        
          } catch (error) {
            console.error("Error fetching trending posts:", error);
            throw new Error("Failed to fetch trending posts");
          }
        },

        popularPosts: async () => {
          try {
            const posts = await prisma.post.findMany({
              where: {
                published: true,
              },
              select: {
                id: true,
                title: true,
                views: true,
                likesCount: true,
                createdAt: true,
                readTime: true,
              },
              include: {
                user: true,
              },
              take:4
            });
            console.log("The post is",post);
        
            const postsWithScore = posts.map(post => {
              const hoursSincePosted = differenceInHours(new Date(), new Date(post.createdAt));
              const score = (post.views * 0.5) + (post.likesCount * 1.5) - (hoursSincePosted * 0.1);
              return {
                ...post,
                score,
              };
            });
            console.log("THe post with Score is:- ",postsWithScore);
        
            const sortedByScore = postsWithScore.sort((a, b) => b.score - a.score);
            console.log("THe sortedBy Score is:- ",sortedByScore);
        
            // ✅ Return top 4 popular posts
            return sortedByScore.slice(0, 4);
        
          } catch (error) {
            console.error("Error fetching popular posts:", error);
            throw new Error("Failed to fetch popular posts");
          }
        },            
    },
        
    Mutation:{
        // Signup a User
        signUpUser:async(_,{userNew})=>{
            const { full_name, email_address, password } = userNew;
            try{
                const existingUser=await prisma.user.findUnique({
                    where:{
                        email_address
                    }
                })
                if(existingUser){
                    throw new Error("User already exists");
                }
                if (!full_name || !email_address || !password) {
                  throw new Error("All fields are required");
              }
                const hashedPassword=await bcrypt.hash(password,10)
                const newUser=await prisma.user.create({
                    data:{
                        full_name,
                        email_address: email_address,
                        password:hashedPassword,
                        createdAt: new Date()
                    }
                })
                return newUser;
            
            }
            catch(err) {
                console.error("Signup error:", err.message);
                throw new Error(err.message);
              }
        },
        // Login a User
        loginUser:async(_,{registeredUser}, { res })=>{
            const {email_address,password}=registeredUser
            try{
                const findUser=await prisma.user.findUnique({
                    where:{
                        email_address
                    }
                })
                if(!findUser){
                    throw new Error("User not registered")
                }
                const comparePassword=await bcrypt.compare(password,findUser.password)
                if (!comparePassword) {
                    throw new Error("Invalid password");
                  }
              
                    const token=jwt.sign({id:findUser.id,email_address:findUser.email_address},process.env.SECRET_KEY,{expiresIn:'2h'})

                    res.cookie('token', token, {
                      httpOnly: true,       // JS can't access cookie
                      // secure: process.env.NODE_ENV === 'production', // only send on HTTPS
                      sameSite: 'strict',   // protect against CSRF
                      maxAge: 60 * 60 * 1000 // 1 hour
                    });

                    return{
                        token
                    }
                }
            catch(err) {
                console.error("Signup error:", err.message);
                throw new Error(err.message);
              }

        },
        // Create a Blog Post
        createBlogPost:async(_,{insertContent},{id})=>{
            const { title, description ,text,cover_img } = insertContent;

            if(!id){
                throw new Error("You must be logged in")
            }
            if (!text || text.length === 0 || text.length > 4) {
                throw new Error("You must add between 1 and 4 tags");
              }
            try{
              let coverImgUrl = null;
              if (cover_img) {
                const uploadResult = await cloudinary.uploader.upload(cover_img, {
                  folder: "blog_covers",
                });
                coverImgUrl = uploadResult.secure_url;
              }
                const tagConnection=await Promise.all(
                    text.map(async(tagText)=>{
                        const existingTag=await prisma.tag.findUnique({
                            where:{
                                text:tagText
                            }
                        })

                        if (existingTag) {
                            return { id: existingTag.id };
                          }
                          else{
                            const createNewTag=await prisma.tag.create({
                                data:{
                                    text:tagText,
                                    user:{
                                        connect: { id },
                                    }
                                }
                              })
                              return { id: createNewTag.id };

                          }
                    })
                )
               
            const enterData=await prisma.post.create({
                data:{
                    title,
                    description,
                    cover_img: coverImgUrl, // Save uploaded image URL Later I will add
                    userId:id,
                    tags:{
                        connect:tagConnection
                    },
                },
                include:{
                    user:true,
                    tags:true
                }
            })
          

            console.log("The enter data is:-",enterData);

            // Me yahan post table update krna chah rha huun keun k readTime add krna he
            const targetId = enterData.id;
            const targetdescription=enterData.description
            const wordCount = targetdescription.trim().split(/\s+/).length;
            console.log('Post:', enterData.title, 'Words:', wordCount);
            const readTime = Math.ceil(wordCount / 200);
            console.log("The read time is",readTime);

            const updatePostTable=await prisma.post.update({
              where:{
                id:targetId,
              },
              data:{
                readTime:readTime,
                published:true
              }
            })
            console.log("The updated post table is:- ",updatePostTable)
            console.log("The created data is:-",targetId);
            return {
              ...enterData,
              readTime: updatePostTable.readTime
            }
              
        }
        catch(err) {
          console.error("Post Creation error:", err);
          throw new Error("Post creation failed: " + (err.message || JSON.stringify(err)));
        }
    },
    // Edit your own Profile
    edit_profile: async (_, { editData }, { id }) => {
      const {
        about_Us,
        twitter_link,
        github_link,
        linkedin_link,
        full_name,
        email_address,
        profile_pic,
        username,
      } = editData;
    
      if (!id) {
        throw new Error("You must be logged in");
      }
    
      try {
        // ✅ Clean profile fields (remove empty strings/null)
        const cleanedProfileData = {
          ...(about_Us?.trim() && { about_Us }),
          ...(twitter_link?.trim() && { twitter_link }),
          ...(github_link?.trim() && { github_link }),
          ...(linkedin_link?.trim() && { linkedin_link }),
        };
    
        // ✅ Upsert Profile
        const edit_data = await prisma.profile.upsert({
          where: { userId: id },
          update: cleanedProfileData,
          create: {
            ...cleanedProfileData,
            user: {
              connect: { id },
            },
          },
          include: {
            user: true,
          },
        });
    
        let uploadedImageUrl = null;
    
        // ✅ Upload profile image (if provided)
        if (profile_pic && profile_pic.trim() !== "") {
          const uploadResult = await cloudinary.uploader.upload(profile_pic, {
            folder: 'profile_pics',
          });
          uploadedImageUrl = uploadResult.secure_url;
        }
    
        // ✅ Clean user fields (skip empty ones)
        const cleanedUserData = {
          ...(full_name?.trim() && { full_name }),
          ...(username?.trim() && { username }),
          ...(email_address?.trim() && { email_address }),
          ...(uploadedImageUrl && { profile_pic: uploadedImageUrl }),
        };
    
        if (Object.keys(cleanedUserData).length > 0) {
          await prisma.user.update({
            where: { id },
            data: cleanedUserData,
          });
        }
    
        return edit_data;
    
      } catch (err) {
        console.error("Edit Profile error:", err.message);
        throw new Error("Something went wrong while updating your profile");
      }
    },
    // Like a Blog Post
    likesPost: async (_, { insertData }, { id }) => {
      const { postId } = insertData;
    
      if (!id) {
        throw new Error("You must be logged in");
      }
    
      try {
        const likeAlreadyExist = await prisma.like.findUnique({
          where: {
            postId_userId: {
              postId: postId,
              userId: id,
            },
          },
        });
    
        if (likeAlreadyExist) {
          // 👎 Already liked → remove like
          await prisma.like.delete({
            where: {
              postId_userId: {
                postId: postId,
                userId: id,
              },
            },
          });
    
          const decrementLikePost = await prisma.post.update({
            where: { id: postId },
            data: {
              likesCount: {
                decrement: 1,
              },
            },
            include: { user: true, tags: true },
          });
    
          return {
            ...decrementLikePost,
            liked: false, // ← now explicitly set liked = false
          };
        } else {
          // 👍 Not yet liked → create like
          const createLike = await prisma.like.create({
            data: {
              postId: postId,
              userId: id,
            },
          });
    
          if (createLike) {
            const incrementLikePost = await prisma.post.update({
              where: {
                id: postId,
              },
              data: {
                likesCount: {
                  increment: 1,
                },
              },
              include: { user: true, tags: true },
            });
    
            return {
              ...incrementLikePost,
              liked: true, // ← now explicitly set liked = true
            };
          }
        }
      } catch (err) {
        console.error("Error on like a Blog Post", err.message);
        throw new Error(err.message);
      }
    },    
      // Comment on a post
      commentPost:async(_,{insertCommentData},{id})=>{
        const {postId,text }=insertCommentData
        if (!id) {
          throw new Error("You must be logged in");
        }
        try{
          const createComment=await prisma.comment.create({
            data:{
              text,
              post: {
                connect: { id: postId }
              },
              user: {
                connect: { id: id } 
              },
            },
           
          })
          console.log("THe createdComment is",createComment);
          if(!createComment){
            throw new Error(`Comment not created on this post-ID ${postId}`)
          }
          else{
            const incrementCommentCount=await prisma.post.update({
              where:{id:postId,
              },
              data:{
                commentCount:{
                  increment:1
                },
                
              },
              include: {
                comments: {
                  include: {
                    user: true // optional, only if your frontend needs it
                  }
                },
                user: true,
                tags: true,
              }
            })
            return incrementCommentCount;

          }


                }
        catch (err) {
          console.error("Error on commmenting a Blog Post", err.message);
          throw new Error(err.message);
        }
      },
      followOtherUser: async (_, { insertFollowingData }, { id }) => {
        const { followingId } = insertFollowingData;
      
        if (!id) throw new Error("You must be logged in");
        if (id === followingId) throw new Error("User cannot follow self");
      
        try {
          const checkFollow = await prisma.follow.findUnique({
            where: {
              followerId_followingId: {
                followerId: id,
                followingId: followingId,
              },
            },
          });
      
          if (checkFollow) {
            // Unfollow logic
            await prisma.follow.delete({
              where: {
                followerId_followingId: {
                  followerId: id,
                  followingId: followingId,
                },
              },
            });
      
            // Optional: Return custom message or null
            return {
              follower: await prisma.user.findUnique({ where: { id } }),
              following: await prisma.user.findUnique({ where: { id: followingId } }),
              createdAt: new Date(),
            };
          }
      
          // Follow logic
          const newFollow = await prisma.follow.create({
            data: {
              follower: { connect: { id } },
              following: { connect: { id: followingId } },
            },
          });
      
          return {
            ...newFollow,
            follower: await prisma.user.findUnique({ where: { id } }),
            following: await prisma.user.findUnique({ where: { id: followingId } }),
          };
        } catch (err) {
          console.error("❌ Follow toggle error:", err.message);
          throw new Error("Could not follow/unfollow user");
        }
      },
      deleteAccount: async (_, __, { id }) => {
        if (!id) {
          throw new Error("You must be logged in");
        }
      
        try {
          await prisma.post.deleteMany({ where: { userId: id } });
          await prisma.tag.deleteMany({ where: { userId: id } });
          await prisma.profile.deleteMany({ where: { userId: id } }); 
          await prisma.like.deleteMany({ where: { userId: id } });
          await prisma.comment.deleteMany({ where: { userId: id } });
          await prisma.follow.deleteMany({
            where: {
              OR: [
                { followerId: id },
                { followingId: id }
              ]
            }
          });
      
          const deletedUser = await prisma.user.delete({
            where: { id }
          });
      
          return deletedUser;
      
        } catch (err) {
          console.error("Error on delete account:", err.message);
          throw new Error(err.message);
        }
      }
      
      
    }
}
module.exports=resolvers
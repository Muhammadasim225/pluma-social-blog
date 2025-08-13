const express=require('express')
const { ApolloServer, gql } = require('apollo-server-express');
const session = require('express-session');
require('./passport')
const cors=require('cors');
const dotenv=require('dotenv').config();
const cookieParser = require('cookie-parser');
const passport = require('passport');
const authRoutes = require('./auth'); // path to your auth.js file
const {ApolloServerPluginLandingPage, ApolloServerPluginLandingPageGraphQLPlayground} =require('apollo-server-core');
const resolvers=require('./resolvers/UserResolver')
const jwt=require('jsonwebtoken');

require('dotenv').config();
const typeDefs=gql`
scalar DateTime

type Query{
users:[User]
posts:[Posts] 
user:User
post(addId:inputAddId!):Posts
deletePost(id:ID!):PostResponse  
tags:[Tag]
tag(id:ID!):Tag
getTagByUserId(id:ID!):[Tag]
getPostByUserId(id:ID!):[PostResponse]
getTargetBlogPostsOthers(id:ID!):[PostResponse]
getAllOtherUserBlogPost:[PostResponse]
getAllBlogPostByLatestSort:[PostResponse]
getOurFollowerCount: Int!
getOurFollowingCount: Int!
getOwnPostCount:Int!
getOtherFollowerCount:Int!
getOtherFollowingCount:Int!
getOtherPostCount:Int!
getSingleFollowerCount(id:ID!):Int!
getSingleFollowingCount(id:ID!):Int!
getSinglePostCount(id:ID!):Int!
getFollowingUserPosts:[PostResponse]
searchArticles(querying:String!):[PostResponse]
getOtherSingleUser(insertId:enterIdData!):User
searchPosts(keywords:String!):[Posts]
getRelatedBlogPosts(addRelatedId:inputAddTheId!):[Posts]
getTrendingPosts:[Posts]
popularPosts:[Posts]
}

input inputAddTheId{
id:String
}

input enterIdData{
id:String
}

input inputAddId{
id:String
}

type Posts{
id:String
title:String
description:String
views:Int
cover_img:String
user:User
likesCount: Int  
tags:[Tag]
likes:[Like]
createdAt: DateTime
readTime: Int
comments:[Comment]
commentCount:Int
}

type PostResponse{
id:String
title:String
description:String
cover_img:String
user:User
views:Int
full_name: String
tags:[Tag]
createdAt: DateTime
likesCount: Int  
likes:[Like] 
readTime:Int! 
comments:[Comment]
commentCount:Int
}

type Comment{
text:String
user:User
createdAt: DateTime
}

type Like{

post:PostResponse
user:User
}

type Follow{
follower:User
following:User
createdAt:DateTime
followerCount: Int
}


type Mutation{
signUpUser(userNew:UserInput!):User
loginUser(registeredUser:enterLoginDetails!):Token
createBlogPost(insertContent:enterAllDetails!):PostResponse
edit_profile(editData: EditProfileInput!): ProfileResponse
likesPost(insertData:enterLikeData!):PostResponse
commentPost(insertCommentData:enterCommentData!):PostResponse
followOtherUser(insertFollowingData:enterFollowingData!):Follow!
deleteAccount: User
}

input enterFollowingData{
followingId:ID
}

type ProfileResponse {
  about_Us: String
  twitter_link: String
  github_link: String
  linkedin_link: String
  user: User
}

type Profile{
userId:String
about_Us:String
twitter_link:String
github_link:String
linkedin_link:String
user: User
}

input enterCommentData{
text:String
postId:String
}
input enterLikeData{
postId:String
}
input EditProfileInput{
about_Us:String
twitter_link:String
github_link:String
linkedin_link:String
profile_pic:String
full_name:String
username:String
email_address:String
}

type Tag{
text:String
user:User
}

input enterAllDetails{
title:String!
description:String!
cover_img:String
text:[String]!
}

type Token{
token:String
}

input enterLoginDetails{
email_address:String!
password:String!
}


input UserInput{
full_name:String!
email_address:String!
password:String!
}
type User{
id:ID
full_name:String
email_address:String
password:String
profile_pic:String
posts:[PostResponse]
followers: [Follow!]! 
following: [Follow!]!

username:String
profile:Profile
followerCount: Int!
followingCount: Int!
postCount:Int!
}
`

const app = express();

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // true in production with HTTPS
      httpOnly: true,
      sameSite: 'lax'
    }
  }));

app.use(passport.initialize())
app.use(passport.session())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use('/auth',authRoutes)


const server=new ApolloServer({
  persistedQueries:false,
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      const tokenFromCookie = req.cookies?.token;
      const authHeader = req.headers?.authorization;
    
      let tokenFromHeader = null;
      if (authHeader) {
        tokenFromHeader = authHeader; // remove "Bearer "
      }
    
      const token = tokenFromCookie || tokenFromHeader;
    
      console.log("🍪 Token from cookie:", tokenFromCookie);
      console.log("🧾 Auth header raw:", authHeader);
      console.log("🎯 Token from header:", tokenFromHeader);
      console.log("✅ Final token used:", token);
    
      let id = null;
      if (token) {
        try {
          const payload = jwt.verify(token, process.env.SECRET_KEY);
          id = payload.id;
          console.log("🔓 Decoded payload:", payload);
        } catch (err) {
          console.warn("❌ Invalid token", err.message);
        }
      }
    
      return { req, res, id };
    },

    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})
const port=process.env.PORT
async function startServer() {
    await server.start();
    server.applyMiddleware({ app, cors: false }); // disable Apollo's internal CORS
  
    app.listen(port, () => {
      console.log(`🚀 Server running at http://postgres:${port}${server.graphqlPath}`);
    });
  }
  
  startServer();
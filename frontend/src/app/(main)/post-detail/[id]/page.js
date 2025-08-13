'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from "next/navigation";
import { useQuery } from '@apollo/client';
import { GET_FOLLOWING_USER_POST, GET_POST_BY_ID, GET_RELATED_POSTS, GET_USER_BY_ID } from '../../../../../gqlOperations/queries';
import ReactMarkdown from 'react-markdown';
import { formatDistanceToNow } from 'date-fns';
import { COMMENT_POST, FOLLOW_OTHER_USER } from '../../../../../gqlOperations/mutations';
import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import defaultProfilePic from '../../../../../public/defaultProfilePic.png'


export default function PostDetail(){
      const { id } = useParams();
      const postId = id;

        const [commentPost]=useMutation(COMMENT_POST)
        const [followOtherUser]=useMutation(FOLLOW_OTHER_USER,{
          refetchQueries:[{query:GET_FOLLOWING_USER_POST}]
        })
                const [follow,following]=useState(true);
        const [isLoggedIn, setIsLoggedIn] = useState(false);
        const [isFollowing, setIsFollowing] = useState(false);
        const [loggedInUserId, setLoggedInUserId] = useState(null);
        const [commentInputs, setCommentInputs] = useState({});
        const [commentCountMap,setCommentCountMap]=useState({})
        const {data:loggedData,loading:loggedLoading,error:loggedError}=useQuery(GET_USER_BY_ID)
        const {data:followingData,loading:followingLoading,error:followingError}=useQuery(GET_FOLLOWING_USER_POST)
        const {data:relatedData,loading:loadingRelated,error:errorLoading}=useQuery(GET_RELATED_POSTS,{
          variables:{
            addRelatedId:{ id }
          },
          skip:!id
        })
          

// To check following lagye yah phir follow lagaye
// to sb sy pehly check krna hoga k 

// lOGGED IN he k nhi ???

// LoggedIn UserId equal ni honi chahye jis ny post create ki he agr equal he toh uss jagah edit profile button aye ga

// loggedInUserId equal bhi to he post k nader jo user he mtlb jis ny post create ki he phir compare krna he jo jo following user post ka data fetch kia he ussy userId mapp krni he folloer toh hum hein mtlb loggedIn UserId or following Id dekhni hogi

// agr following user post me user ki id hoye toh mtlb loggedInUserId ny follow kia hua he user wrna nhi kia hua

      const {data,loading,error,refetch}=useQuery(GET_POST_BY_ID,{
        variables:{
          addId:{ id }
        },
        skip:!id
      })
      const postURL = typeof window !== "undefined"
  ? `${window.location.origin}/post-detail/${id}`
  : "";

      if (error) {
        console.log("Rehny dy error aa gya", error); // <-- Add this
      }
    if (data) {
      console.log("Akhir kaar data aa gya", data);
    }
    useEffect(() => {
      const checkLogin = async () => {
        try {
          const res = await fetch("/api/test-token", {
            method: 'GET',
            credentials: 'include',
          });
    
          const data = await res.json();
          console.log("Token check response:", data);
    
          if (data?.cookies) {
            const decoded = jwtDecode(data.cookies);
            setIsLoggedIn(true);
            setLoggedInUserId(decoded.id); 

          } else {
            setIsLoggedIn(false);
            setLoggedInUserId(null);
          }
        } catch (err) {
          console.error("Error fetching token:", err);
          setIsLoggedIn(false);
          setLoggedInUserId(null);
        }
      };
    
      checkLogin();
    }, []);
    

    const handleInputChange = (postId, value) => {
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: value
      }));
    };

    const handleCommentClick=async(postId)=>{
      const text=commentInputs[postId]
      console.log("The post-id is:- ",postId);
      console.log("The text is:- ",text);
  
  
      if (!text || text.trim() === "") {
        console.log("The text is inside block:- ",text);
        alert("Comment cannot be empty");
        return;
      }
  
      try{
        const res=await commentPost({
          variables:{
            insertCommentData:{
              postId:postId,
              text:text
            }
  
          }
        })

        const updatedCommentCount = res.data.commentPost.commentCount;
        console.log("Updated Comment Count:", updatedCommentCount);
    
        setCommentCountMap((prev) => ({
          ...prev,
          [postId]: updatedCommentCount,
        }));
    
        setCommentInputs((prev) => ({
          ...prev,
          [postId]: "",
        }));
        await refetch(); 
       
  
      }
      catch (err) {
        console.error("Error on comment a post:", err.message);
      }
    }
   
    const handleShare = async () => {
      if (navigator.share) {
        // 📱 Native mobile/web share dialog
        try {
          await navigator.share({
            title: data?.post?.title || "Check this blog post!",
            text: "Found this on Pluma — have a look!",
            url: postURL
          });
        } catch (err) {
          console.error("Error sharing:", err.message);
        }
      } else {
        // Fallback: copy to clipboard
        try {
          await navigator.clipboard.writeText(postURL);
          alert("Link copied to clipboard!");
        } catch (err) {
          console.error("Failed to copy:", err.message);
        }
      }
    };

    const handleFollowClick = async () => {
      try {
        const authorId = data?.post?.user?.id;
        if (!authorId) return;
    
        await followOtherUser({
          variables: {
            insertFollowingData: {
              followingId: authorId, // ✅ Correct user ID
            },
          },
        });

        setIsFollowing(true);
        await refetch();
        console.log("Follow/unfollow request sent successfully!");
      } catch (error) {
        console.error("Follow toggle error:", error.message);
      }
    };
    
            console.log("The Logged User-ID is:- ",isLoggedIn)
            
            useEffect(() => {
              console.log("URL ID (useParams):", id);
              console.log("Logged-in user ID (JWT):", isLoggedIn);
              console.log("Are they equal:", isLoggedIn === id);
            }, [isLoggedIn, id]);
            
            
            useEffect(() => {
              if (!data?.post?.user?.followers || !loggedInUserId) return;

              const alreadyFollowing = data.post.user.followers.some(
                abc => abc.follower.id === loggedInUserId
              );
              console.log("THe already following is:- ",alreadyFollowing);

              setIsFollowing(alreadyFollowing);
            }, [data, loggedInUserId]);

            
            
            
            
            useEffect(() => {
              console.log("loggedInUserId available:", isLoggedIn);
            }, [isLoggedIn]);
            
            useEffect(() => {
              console.log("Fetched user data:", data);
            }, [data]);
    
    
            console.log("The logged-In user-id is:- ",loggedInUserId);
    

    return (

        <div className="bg-[#F9FAFB] text-gray-800 min-h-screen px-4 py-20 sm:px-6 lg:px-8">
          {loading && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
    {/* Spinner */}
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>

  </div>
)}

        <article className="max-w-3xl mx-auto space-y-8">
          <header>
            {
              data?.post && ( <h1 className=" prose text-3xl sm:text-4xl font-bold text-gray-900">
                {data.post.title}
              </h1>)


            }
           
            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <Image
                src={defaultProfilePic}
                alt="Sarah Chen"
                className="w-8 h-8 rounded-full"
                width={8}
                height={10}
              />
              {
                data?.post && ( <Link href="/user-profile"><p className="font-medium text-gray-700">{data.post.user.full_name}</p></Link>)
              }
             
              <p>• Published on {new Date(data?.post?.createdAt).toLocaleDateString('en-US', {
    month: 'short',  // "Jul"
    day: 'numeric',  // "8"
    year: 'numeric'  // "2025"
  })}</p>
              {
                data?.post && (<p>• {data.post.readTime} min read</p>
                )
              }

             
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
  {data?.post?.tags.map((abc, ind) => (
    <span
      key={ind}
      className="bg-blue-100 text-indigo-600 text-xs font-medium px-2 py-1 rounded"
    >
      {abc.text}
    </span>
  ))}
</div>
           
          </header>
  
          <article className="prose max-w-4xl mx-auto mt-10">
      
      {/* Cover Image */}
      {data?.post.cover_img?.trim() ? (
  <Image
    src={data.post.cover_img}
    alt="Cover"
    width={800}
    height={400}
    className="w-full h-auto rounded-md shadow-md"
  />
) : null}

      {/* Render Markdown */}
      <ReactMarkdown>
        {data?.post.description}
      </ReactMarkdown>

      {/* Optional custom content or sections */}
   
    </article>
  
          <div className="flex justify-end items-center text-sm text-gray-500 border-t pt-6">
          
            <div className="flex gap-4">
            <button onClick={handleShare} className="hover:text-indigo-600 cursor-pointer transition-all flex items-center gap-1">
  <FontAwesomeIcon icon={faShare} />
  Share
</button>

              <button className="hover:text-gray-800">🔖 Save</button>
            </div>
          </div>
  
          {/* Author Box */}
          <div className="mt-8 bg-white rounded-lg p-6 flex items-center gap-4">

          <Image
  src={
    data?.post?.user?.profile_pic && data.post.user.profile_pic.trim() !== ""
      ? data.post.user.profile_pic
      : defaultProfilePic
  }
  width={56}
  height={56}
  alt="Sarah Chen"
  className="w-14 h-14 rounded-full"
/>
            
            <div>
              <h3 className="font-semibold text-gray-900">{data?.post.user.full_name}</h3>
             
              <p className="text-sm text-gray-600">
              {data?.post?.user?.profile?.about_Us || "User has not added an About section yet."}
              </p>

              {!data?.post || isLoggedIn === null ? (
  <div className="mt-4">Checking follow status...</div>
) : loggedInUserId === data.post.user.id ? (
  <Link href="/own-profile">
    <button className="mt-4 px-4 py-2 rounded cursor-pointer text-white bg-indigo-600 hover:bg-indigo-700">
      Edit Profile
    </button>
  </Link>
) : (
  <button
    onClick={handleFollowClick}
    className={`mt-4 px-4 py-2 rounded cursor-pointer ${
      isFollowing ? "bg-gray-300 text-black" : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
  >
    {isFollowing ? "Following" : "Follow"}
  </button>
)}



            </div>
          </div>
  
          {/* Comments Section */}
        
          <section className="mt-12">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Comments</h4>
  
            <div className="mb-6 flex items-start gap-4">
            <Image
  src={
    loggedData?.user?.profile_pic && loggedData.user.profile_pic.trim() !== ""
      ? loggedData.user.profile_pic
      : defaultProfilePic
  }
  alt="User"
  width={40}
  height={40}
  className="w-10 h-10 rounded-full"
/>
              <form onSubmit={(e) => {
e.preventDefault();
handleCommentClick(data?.post?.id)
}}>
              <div className="flex-1">
                <textarea
                  placeholder="Write a comment..."
                  value={commentInputs[data?.post?.id] || ""}
onChange={(e) => handleInputChange(data?.post?.id, e.target.value)}

                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ></textarea>
                <button type='submit' className=" mt-2 text-sm text-white bg-indigo-600 cursor-pointer hover:bg-indigo-700 px-4 py-1 rounded">
                  Post Comment 
                </button>
              </div>
              </form>
            </div>
  
            {/* Comment 1 */}

            {
            data?.post.comments.map((abc,ind)=>(
              <div key={ind} className="flex items-start gap-4 mb-6">
             <Image
  src={abc.user.profile_pic}
  alt="Alex Thompson"
  width={40}
  height={40}
  className="w-10 h-10 rounded-full"
/>
              <div>
                <p className="font-medium text-sm text-gray-900">{abc.user.full_name}<span className="text-xs text-gray-400"> •{formatDistanceToNow(new Date(abc.createdAt), { addSuffix: true })}</span></p>
                <p className="text-sm text-gray-700 mt-1">
                  {abc.text}
                </p>
              
              </div>
            </div>

            ))
          }
            
  
            {/* Comment 2 */}
          </section>
  
          {/* More from GraphBlog */}
          <section className="mt-12">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">More from Pluma</h4>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">


            {loadingRelated ? (
  <p>Loading related posts...</p>
) : errorLoading ? (
  <p className="text-red-500 text-sm">Failed to load related posts.</p>
) : relatedData?.getRelatedBlogPosts?.length > 0 ? (
  relatedData.getRelatedBlogPosts.map((abc) => (
    <Link key={abc.id} href={`/post-detail/${abc.id}`} className="block">
      <div className="flex flex-col h-full bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <Image
  src={abc.cover_img}
  alt="Post"
  width={600} // Approx width (you can tweak)
  height={128} // h-32 = 8rem = 128px
  className="w-full h-32 object-cover"
/>
        <div className="flex flex-col flex-grow p-4">
          <h5 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">
            {abc.title}
          </h5>
          <div className="mt-auto text-xs text-gray-500">
            {abc.user?.full_name || "Unknown Author"} •{" "}
            {new Date(abc.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      </div>
    </Link>
  ))
) : (
  <p className="text-gray-400 text-sm">No related posts found.</p>
)}

              
             
            
            </div>
          </section>
        </article>
      </div>
    )
}
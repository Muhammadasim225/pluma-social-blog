"use client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { Heart, MessageCircle } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ALL_POSTS, GET_FOLLOWING_USER_POST, GET_TRENDING_POSTS } from "../../../gqlOperations/queries";
import { LIKE_POST } from "../../../gqlOperations/mutations";
import { COMMENT_POST } from "../../../gqlOperations/mutations";
import { AlertCircleIcon} from "lucide-react"
// import { PostSkeleton } from "./skeletons/PostSkeleton";
import PostSkeleton from "./skeletons/PostSkeleton/page";
import landingPageImg from '../../../public/landing-page-img.jpg'
import { formatDistanceToNow } from 'date-fns';
import { useRef } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import removeMarkdown from 'remove-markdown';
import defaultProfilePic from '../../../public/defaultProfilePic.png'


export default function Home() {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);
  const { data:followingData, loading:followingLoading, error:followingError } = useQuery(GET_FOLLOWING_USER_POST);
  const [likePost] = useMutation(LIKE_POST);
  const [likesCountMap, setLikesCountMap] = useState({});
  const [commentCountMap,setCommentCountMap]=useState({})
  const [openCommentBoxId, setOpenCommentBoxId] = useState(null);
  const [likedPosts, setLikedPosts] = useState({});
  const [commentPost]=useMutation(COMMENT_POST)
  const [commentInputs, setCommentInputs] = useState({});
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("forYou");
  const inputRefs = useRef({});
  const {data:trendingData,loading:trendingLoading,error:trendingError}=useQuery(GET_TRENDING_POSTS)



  
if(followingLoading){
  console.log('Ruk jaa following user Post load ho rhi hein....');
}
if(followingError){
  console.log('Error aa gya following user post krny me');
}

  useEffect(() => {
    if (data?.posts) {
      const initialLikes = {};
      const initialCounts = {};
  
      data.posts.forEach((post) => {
        initialLikes[post.id] = post.liked;
        initialCounts[post.id] = post.likesCount;
      });
  
      setLikedPosts(initialLikes);
      setLikesCountMap(initialCounts);
    }
  }, [data]);

  

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
      console.log("This is updated Comment Count:- ",updatedCommentCount);
   

      setCommentCountMap((prev) => ({
        ...prev,
        [postId]: (prev[postId] ?? data.posts.find(p => p.id === postId)?.commentCount ?? 0) + 1,
      }));
      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));

      setOpenCommentBoxId(null);
    }
    catch (err) {
      const res=await fetch('/api/test-token',{
        method:'GET',
        credentials:'include'
      })

      const data = await res.json();
      console.log("Token check response:", data);

      if (!data?.cookies) {
        setShowLoginAlert(true);
        return;
      }
      
      console.error("Error on comment a post:", err.message);
    }
  }

  // const [likesCountMap, setLikesCountMap] = useState({});


  console.log("The data is:- ",data);

  const handleCommentBox = (postId) => {
    setOpenCommentBoxId((prev) => (prev === postId ? null : postId));
  };
  const handleLikeClick = async (postId) => {
    if (!postId) return;
  
    try {
      const res = await likePost({
        variables: {
          insertData: {
            postId,
          },
        },
      });
  
      const updatedCount = res.data.likesPost.likesCount;
      const userLiked = res.data.likesPost.liked;
  
      // Only update for this post and this user
      setLikedPosts((prev) => ({
        ...prev,
        [postId]: userLiked,
      }));
  
      setLikesCountMap((prev) => ({
        ...prev,
        [postId]: updatedCount,
      }));
      if (inputRefs.current[postId]) {
        inputRefs.current[postId].style.text = 'red';
      }      
    } catch (err) {
      const res=await fetch('/api/test-token',{
        method:'GET',
        credentials:'include'
      })

      const data = await res.json();
      console.log("Token check response:", data);

      if (!data?.cookies) {
        setShowLoginAlert(true);
        return;
      }
      console.error("Error liking post:", err.message);
    }
  };



  const handleFollowingClick = () => setActiveTab("following");
  const handleForYouClick = () => setActiveTab("forYou");
  
  const handleTrendingClick=()=>{
    setActiveTab("trending");

  }
 
  if (error) return(
    <>
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
    <Alert variant="default" className="mb-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Connection Error <Link href="/" className="text-indigo-600 underline">Try Again</Link></AlertTitle>
     
    </Alert></div>
     
    </>
  );




  return (
    <>
  
   
   {showLoginAlert && (
  <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
    <Alert variant="destructive" className="shadow-lg">
      <AlertCircleIcon className="h-5 w-5" />
      <AlertTitle>You must be logged in</AlertTitle>
      <AlertDescription>
        <span>
        Please <a href="/login" className="text-indigo-600 underline">log in</a> to like and comments on posts.

        </span>
      
      </AlertDescription>
    </Alert>
  </div>
)}
      {/* Hero Section */}
      <section className="lg:px-20 md:px-10 md:mt-8 px-5 mt-4 lg:mt-0  xl:mt-0  w-full py-20  bg-white">
  <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10">
    
    {/* TEXT CONTENT (Left Side) */}
    <div className="w-full lg:w-1/2 mb-5 sm:mb-0 lg:mb-0 md:mb-5 xl:mb-0  text-center lg:text-left">
      <Link href="/search-result">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Share Your Thoughts with the World
        </h1>
      </Link>
      <p className="mt-4 text-gray-600 text-base sm:text-lg">
        Join our community of writers and readers to explore ideas that matter
      </p>
      <Link href="/create-post">
        <button className="mt-6 cursor-pointer transition-all px-6 py-3 text-white text-sm sm:text-base font-medium rounded-md bg-indigo-600 hover:bg-indigo-700">
          Start Writing Today
        </button>
      </Link>
    </div>

    {/* IMAGE (Right Side) */}
    <div className="w-full lg:w-1/2">
      <Image
        src={landingPageImg} // Replace with actual path
        alt="Blogging illustration"
        className="w-full h-auto object-cover "
      />
    </div>
    
  </div>
</section>


      {/* Blog Feed */}
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-10 text-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="flex-1 space-y-6">
          <div className="flex gap-6 border-b border-gray-200 text-sm font-medium text-gray-500">
  <button
    onClick={handleForYouClick}
    className={`pb-2 cursor-pointer ${activeTab === "forYou" ? "text-indigo-600 border-b-2 border-indigo-600" : "hover:text-indigo-700"}`}
  >
    For You
  </button>
  <button
    onClick={handleFollowingClick}
    className={`pb-2 cursor-pointer ${activeTab === "following" ? "text-indigo-600 border-b-2 border-indigo-600" : "hover:text-indigo-700"}`}
  >
    Following
  </button>
  <button onClick={handleTrendingClick}
 className={`pb-2 cursor-pointer ${activeTab === "trending" ? "text-indigo-600 border-b-2 border-indigo-600" : "hover:text-indigo-700"}`}>Trending</button>

</div>



            {/* Posts */}

            {activeTab === "forYou" && (
  loading ? (
    <>
     <PostSkeleton></PostSkeleton>
     <PostSkeleton></PostSkeleton>
     <PostSkeleton></PostSkeleton>
    </>
  ) : data.posts.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75h4.5m-4.5 4.5h4.5M12 3a9 9 0 100 18 9 9 0 000-18z"
        />
      </svg>
      <h2 className="text-xl font-semibold text-gray-700">No posts available</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Looks like there&rsquo;s nothing here right now. Once new posts are published, you&rsquo;ll see them here.
      </p>
      <Link href="/create-post">
        <button className=" cursor-pointer transition-all mt-6 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ">
          Start a Post
        </button>
      </Link>
    </div>
  ) :(data.posts.map((post) => (
    <div key={post.id} className="cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Author */}
      <div className="p-5 flex items-center gap-3">
  {/* Profile Picture */}
  <Link href={`/user-profile/${post.user.id}`} >
  <div className="w-10 h-10 relative">
  <Image
    src={post.user.profile_pic || defaultProfilePic}
    alt={`${post.user.full_name}'s profile picture`}
    fill
    className="rounded-full object-cover"
  />
</div>
  </Link>

  {/* Name and Time */}
  <div className="flex flex-col">
    <Link href={`/user-profile/${post.user.id}`}>
      <p className="font-medium text-sm hover:underline">{post.user.full_name}</p>
    </Link>
    <p className="text-xs text-gray-400">
  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
</p>  </div>
</div>


      {/* Image */}
      <Link href={`/post-detail/${post.id}`}>
      <Image
    src={post.cover_img}
    alt="Cover Image"
    width={800}
    height={256}
    className="w-full h-64 object-cover px-5"
  />
        </Link>
      
     

      {/* Content */}
      <div className="p-5 space-y-2">
      <Link href={`/post-detail/${post.id}`}>
        <h2 className="text-lg font-semibold">{post.title}</h2>
      </Link>
      <Link href={`/post-detail/${post.id}`}>
        <p className="text-sm text-gray-600">
        {removeMarkdown(post.description).length > 400
            ? removeMarkdown(post.description).slice(0, 350) + "..."
            : removeMarkdown(post.description)}
        </p>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag.text}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-6 mt-6 items-center">
          {/* Like */}
          <div className="flex items-center space-x-1">
          {likedPosts[post.id] ? (
  <Heart
    onClick={() => handleLikeClick(post.id)}
    className="w-5 h-5 cursor-pointer stroke-red-500 fill-red-500"
  />
) : (
  <Heart
    onClick={() => handleLikeClick(post.id)}
    className="w-5 h-5 cursor-pointer stroke-gray-500 fill-transparent"
  />
)}



            <span className="text-sm text-gray-600">
{likesCountMap[post.id] ?? post.likesCount} Likes
</span>
          </div>

          {/* Comment */}
          <div className="flex items-center space-x-1">
            <MessageCircle
              onClick={() => handleCommentBox(post.id)}
              className="text-gray-500 w-5 h-5 cursor-pointer"
            />
              
            <span className="text-sm text-gray-600">
            {commentCountMap[post.id] ?? post.commentCount} Comments
</span>
          </div>

        </div>
      </div>

      {/* Comment Box */}
      {openCommentBoxId === post.id && (
        <div className="w-full px-4 py-2">
          <form  onSubmit={(e) => {
e.preventDefault();
handleCommentClick(post.id);
}} className="flex items-center gap-2">
            <input
              type="text"
              value={commentInputs[post.id] || ""}
              id="comment-box"
              onChange={(e) => handleInputChange(post.id, e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Comment
            </button>
          </form>
        </div>
      )}
    </div>
  ))))}

{activeTab === "following" && (
  followingLoading ? (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  ) : (followingData?.getFollowingUserPosts?.length ?? 0) === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-700">No following posts found.</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Follow some authors to start seeing posts here.
      </p>
    </div>
  ) : (followingData?.getFollowingUserPosts.map((post) => (
    <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Author */}
      <div className="p-5 flex items-center gap-3">
  {/* Profile Picture */}
  <Link href={`/user-profile/${post.user.id} || defaultProfilePic`}>
  <div className="w-10 h-10 relative">
  <Image
    src={post.user.profile_pic  || defaultProfilePic}
    alt={`${post.user.full_name}'s profile picture`}
    fill
    className="rounded-full object-cover"
  />
</div>
  </Link>

  {/* Name and Time */}
  <div className="flex flex-col">
    <Link href={`/user-profile/${post.user.id}`}>
      <p className="font-medium text-sm hover:underline">{post.user.full_name}</p>
    </Link>
    <p className="text-xs text-gray-400">
  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
</p>  </div>
</div>


      {/* Image */}
      <Link href={`/post-detail/${post.id}`}>
           <Image
    src={post.cover_img}
    alt="Cover Image"
    width={800}
    height={256}
    className="w-full h-64 object-cover px-5"
  />
        </Link>
      
     

      {/* Content */}
      <div className="p-5 space-y-2">
      <Link href={`/post-detail/${post.id}`}>
        <h2 className="text-lg font-semibold">{post.title}</h2>
      </Link>
      <Link href={`/post-detail/${post.id}`}>

        <p className="text-sm text-gray-600">
          {removeMarkdown(post.description).length > 400
            ? removeMarkdown(post.description).slice(0, 350) + "..."
            : removeMarkdown(post.description)}
        </p>
        </Link>


        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag.text}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-6 mt-6 items-center">
          {/* Like */}
          <div className="flex items-center space-x-1">
          {likedPosts[post.id] ? (
<FontAwesomeIcon
icon={faHeart}
onClick={() => handleLikeClick(post.id)}
className="text-red-500 text-xl cursor-pointer"
/>
) : (
<Heart
onClick={() => handleLikeClick(post.id)}
className="text-gray-500 w-5 h-5 cursor-pointer"
/>
)}

            <span className="text-sm text-gray-600">
{likesCountMap[post.id] ?? post.likesCount} Likes
</span>
          </div>

          {/* Comment */}
          <div className="flex items-center space-x-1">
            <MessageCircle
              onClick={() => handleCommentBox(post.id)}
              className="text-gray-700 w-5 h-5 cursor-pointer"
            />
            
            
            <span className="text-sm text-gray-600">
            {commentCountMap[post.id] ?? post.commentCount} Comments
</span>
          </div>

        </div>
      </div>

      {/* Comment Box */}
      {openCommentBoxId === post.id && (
        <div className="w-full px-4 py-2">
          <form  onSubmit={(e) => {
e.preventDefault();
handleCommentClick(post.id);
}} className="flex items-center gap-2">
            <input
              type="text"
              value={commentInputs[post.id] || ""}
              id="comment-box"
              onChange={(e) => handleInputChange(post.id, e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Comment
            </button>
          </form>
        </div>
      )}
    </div>
  ))))}

{activeTab === "trending" && (
  loading ? (
    <>
      <PostSkeleton />
      <PostSkeleton />
      <PostSkeleton />
    </>
  ) : trendingData.posts.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-lg shadow-sm ">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 text-gray-300 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.75 9.75h4.5m-4.5 4.5h4.5M12 3a9 9 0 100 18 9 9 0 000-18z"
        />
      </svg>
      <h2 className="text-xl font-semibold text-gray-700">No trending posts available</h2>
      <p className="text-gray-500 mt-2 max-w-md">
        Looks like there&rsquo;s nothing here right now.
      </p>
      <Link href="/create-post">
        <button className=" cursor-pointer transition-all mt-6 px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ">
          Start a Post
        </button>
      </Link>
    </div>
  ) : (trendingData.posts.map((post) => (
    <div key={post.id} className="cursor-pointer bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Author */}
      <div className="p-5 flex items-center gap-3">
  {/* Profile Picture */}
  <Link href={`/user-profile/${post.user.id} `}>
  <div className="w-10 h-10 relative">
  <Image
    src={post.user.profile_pic || defaultProfilePic}
    alt={`${post.user.full_name}'s profile picture`}
    fill
    className="rounded-full object-cover"
  />
</div>
  </Link>

  {/* Name and Time */}
  <div className="flex flex-col">
    <Link href={`/user-profile/${post.user.id}`}>
      <p className="font-medium text-sm hover:underline">{post.user.full_name}</p>
    </Link>
    <p className="text-xs text-gray-400">
  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
</p>  </div>
</div>


      {/* Image */}
      <Link href={`/post-detail/${post.id}`}>
      <Image
    src={post.cover_img}
    alt="Cover Image"
    width={800}
    height={256}
    className="w-full h-64 object-cover px-5"
  />
  </Link>
      
     

      {/* Content */}
      <div className="p-5 space-y-2">
      <Link href={`/post-detail/${post.id}`}>
        <h2 className="text-lg font-semibold">{post.title}</h2>
      </Link>
      <Link href={`/post-detail/${post.id}`}>
        <p className="text-sm text-gray-600">
        {removeMarkdown(post.description).length > 400
            ? removeMarkdown(post.description).slice(0, 350) + "..."
            : removeMarkdown(post.description)}
        </p>
        </Link>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 pt-2">
          {post.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              {tag.text}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-6 mt-6 items-center">
          {/* Like */}
          <div className="flex items-center space-x-1">
          {likedPosts[post.id] ? (
  <Heart
    onClick={() => handleLikeClick(post.id)}
    className="w-5 h-5 cursor-pointer stroke-red-500 fill-red-500"
  />
) : (
  <Heart
    onClick={() => handleLikeClick(post.id)}
    className="w-5 h-5 cursor-pointer stroke-gray-500 fill-transparent"
  />
)}



            <span className="text-sm text-gray-600">
{likesCountMap[post.id] ?? post.likesCount} Likes
</span>
          </div>

          {/* Comment */}
          <div className="flex items-center space-x-1">
            <MessageCircle
              onClick={() => handleCommentBox(post.id)}
              className="text-gray-500 w-5 h-5 cursor-pointer"
            />
              
            <span className="text-sm text-gray-600">
            {commentCountMap[post.id] ?? post.commentCount} Comments
</span>
          </div>

        </div>
      </div>

      {/* Comment Box */}
      {openCommentBoxId === post.id && (
        <div className="w-full px-4 py-2">
          <form  onSubmit={(e) => {
e.preventDefault();
handleCommentClick(post.id);
}} className="flex items-center gap-2">
            <input
              type="text"
              value={commentInputs[post.id] || ""}
              id="comment-box"
              onChange={(e) => handleInputChange(post.id, e.target.value)}
              className="flex-1 px-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
              placeholder="Add a comment..."
            />
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Comment
            </button>
          </form>
        </div>
      )}
    </div>
  ))))}
  
  
            
          </div>

          {/* Right Sidebar - Trending */}
          <aside className="w-full lg:w-72 bg-white rounded-xl shadow-sm p-5 space-y-4">
  <h3 className="text-md font-semibold text-gray-700">Trending on Pluma</h3>
  <ol className="space-y-2 text-sm text-gray-600">
    {trendingData?.posts.map((post, index) => (
      <li key={index}>
        <span className="text-indigo-600 font-bold mr-2">{index + 1}</span> {post.title}
        <p className="text-xs text-gray-400">
          By {post.user.full_name} • {post.readTime} min read
        </p>
      </li>
    ))}
  </ol>
</aside>
        </div>
      </div>
    </>
  );
}

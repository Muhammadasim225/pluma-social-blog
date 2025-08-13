'use client'
import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "next/navigation";
import Image from "next/image";
import { GET_FOLLOWING_USER_POST, GET_OTHER_USER_BY_ID } from "../../../../../gqlOperations/queries";
import { FOLLOW_OTHER_USER } from "../../../../../gqlOperations/mutations";
import { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from 'jwt-decode';
import removeMarkdown from 'remove-markdown';
import Link from "next/link";
import defaultProfilePic from '../../../../../public/defaultProfilePic.png'
export default function UserProfile(){

  const { id } = useParams();
  const [followOtherUser]=useMutation(FOLLOW_OTHER_USER,{
        refetchQueries:[{query:GET_FOLLOWING_USER_POST}]
      })

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  
    const {data,loading,error,refetch }=useQuery(GET_OTHER_USER_BY_ID,{
      variables:{
        insertId:{ id }
      },
      skip: !id
    })


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
    
    
        if (error) {
            console.log("Rehny dy error aa gya", error); // <-- Add this
          }
        if (data) {
          console.log("Akhir kaar data aa gya", data);
        }

        const handleFollowClick = async () => {
          try {
            await followOtherUser({
              variables: {
                insertFollowingData: {
                  followingId: id,
                },
              },
            });
            await refetch();
        
            console.log("Follow/unfollow request sent successfully!");
          } catch (error) {
            console.error("Follow toggle error:", error.message);
          }
        };
        console.log("The Logged User-ID is:- ",loggedInUserId)
        
        useEffect(() => {
          console.log("URL ID (useParams):", id);
          console.log("Logged-in user ID is true/false:", isLoggedIn);
          console.log("Are they equal:", loggedInUserId === id);
        }, [isLoggedIn, id,loggedInUserId]);
        

        useEffect(() => {
          if (data?.getOtherSingleUser?.followers && loggedInUserId) {
            const alreadyFollowing = data.getOtherSingleUser.followers.some(
              abc => abc.follower.id === loggedInUserId
            );
        
            console.log("This is already Following", alreadyFollowing); // ✅ true or false
            setIsFollowing(alreadyFollowing);
          }
        }, [data, loggedInUserId]);
        
        
        
        useEffect(() => {
          console.log("loggedInUserId available:", isLoggedIn);
        }, [isLoggedIn]);
        
        useEffect(() => {
          console.log("Fetched user data:", data);
        }, [data]);


        console.log("The logged-In user-id is:- ",loggedInUserId);
        
        
    return (

        <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-6 lg:px-8">

{loading && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
    {/* Spinner */}
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>

  </div>
)}

        <div className="max-w-3xl mx-auto">
          {/* Profile Header */}
          {data?.getOtherSingleUser && (

                <div className="bg-white shadow rounded-xl p-6 text-center">
  <div>
  <div className="w-16 h-16 relative mx-auto mb-2">
    <Image
      src={data?.getOtherSingleUser?.profile_pic || defaultProfilePic}
      alt={`${data.getOtherSingleUser.full_name}'s profile picture`}
      className=" mx-auto mb-4 rounded-full object-cover"
      fill
    />
</div>

    <h2 className="text-2xl font-semibold text-gray-900">{data.getOtherSingleUser.full_name}</h2>
    <p className="text-gray-600">{data.getOtherSingleUser.email_address}</p>
  </div>
            <p className="mt-2 text-sm text-gray-500">
              {data.getOtherSingleUser?.profile?.about_Us}
            </p>
            <div className="mt-5 flex justify-center space-x-6 text-sm text-gray-700">
              <span>{data?.getOtherSingleUser?.followerCount} Followers</span>
              <span>{data?.getOtherSingleUser?.followingCount} Following</span>
              <span>{data?.getOtherSingleUser?.postCount} Posts</span>
            </div>
            {!data || isLoggedIn === null ? (
  <div className="mt-4">Checking follow status...</div>
) : loggedInUserId === id ? (
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
          )}
  
        
         
          {/* Posts Section */}
         
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Posts ({
            data?.getOtherSingleUser.postCount
          })</h3>
              <select className=" focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-600 border rounded px-2 py-1">
                <option>Sort by: Newest</option>
              </select>
            </div>
  
            <div className="space-y-6">
              {data?.getOtherSingleUser?.posts.map((post, idx) => (
                  <Link key={idx} href={`/post-detail/${post.id}`} className="block">

                <div key={idx} className="cursor-pointer bg-white shadow rounded-xl p-5">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 mb-3"> {removeMarkdown(post.description).length > 350
            ? removeMarkdown(post.description).slice(0, 200) + "..."
            : removeMarkdown(post.description)}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-indigo-600 mb-3">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="bg-violet-100 px-2 py-1 rounded">
                        {tag.text}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',  // "Jul"
    day: 'numeric',  // "8"
    year: 'numeric'  // "2025"
  })}</span>
                    <div className="flex items-center space-x-4">
                      <span>{post.views} views</span>
                      <span>{post.likesCount} likes</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
}
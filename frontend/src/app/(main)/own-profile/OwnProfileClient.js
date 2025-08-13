'use client';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { useEffect, useImperativeHandle, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { COMMENT_POST, DELETE_ACCOUNT, EDIT_OUR_PROFILE } from '../../../../gqlOperations/mutations';
import { toast } from "sonner"
import { GET_ALL_POSTS, GET_FOLLOWING_USER_POST, GET_OTHER_USER_BY_ID, GET_OUR_FOLLOWER_COUNT, GET_OUR_FOLLOWING_COUNT, GET_RELATED_POSTS, GET_TRENDING_POSTS, GET_USER_BY_ID, SEARCH_RESULTS } from '../../../../gqlOperations/queries';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { jwtDecode } from 'jwt-decode';

export default function OwnProfileClient() {
    const router=useRouter();
    const [editProfile,{data,loading,error}]=useMutation(EDIT_OUR_PROFILE,{
      refetchQueries:[{query:GET_USER_BY_ID},
        {query:GET_FOLLOWING_USER_POST},
        {query:GET_ALL_POSTS},
        {query:GET_TRENDING_POSTS},
        {query:GET_OTHER_USER_BY_ID}
      ]
    })
    const {data: followerData, loading: followerLoading, error: followerError}=useQuery(GET_OUR_FOLLOWER_COUNT)
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loggedInUserId, setLoggedInUserId] = useState(null);
    const {data: followingData, loading: followingLoading, error: followingError}=useQuery(GET_OUR_FOLLOWING_COUNT,
      {skip:!GET_USER_BY_ID})
    const [publicId,setPublicId]=useState("")
    const [formData,setFormData]=useState({})
    const [deleteAccount, { data: deleteData, loading: deleteLoading, error: deleteError }] = useMutation(DELETE_ACCOUNT,{
      refetchQueries:[{query:GET_ALL_POSTS},
        {query:GET_FOLLOWING_USER_POST},
        {query:GET_TRENDING_POSTS},
        {query:GET_RELATED_POSTS},
        {query:SEARCH_RESULTS},
        {query:GET_USER_BY_ID}
      ]
    });
  
    
     const { data:targteUserData,loading:targetUserLoading,error:targetUserError } = useQuery(GET_USER_BY_ID,{skip: !isLoggedIn})
  
  
     useEffect(() => {
      if (targteUserData?.user) {
      const personalInfo=targteUserData?.user ? {   full_name: targteUserData.user.full_name || "",
        email_address: targteUserData.user.email_address || "",
      }:{}
      const optionalInfo=targteUserData?.user ? { username: targteUserData.user.username || "",}:{}
        const profileInfo = targteUserData.user.profile
          ? {
              about_Us: targteUserData.user.profile.about_Us || "",
              linkedin_link: targteUserData.user.profile.linkedin_link || "",
              github_link: targteUserData.user.profile.github_link || "",
              twitter_link: targteUserData.user.profile.twitter_link || "",
            }
          : {};
    
        setFormData({
          ...personalInfo,
          ...optionalInfo,
          ...profileInfo,
        });
  
        setPublicId(targteUserData.user.profile_pic || "");
      }
    }, [targteUserData]);
  
  
     
     if(targetUserError){
      console.log("Abi target User error aaagya he ...",targetUserError);
     }
     
    useEffect(()=>{
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
          }
          catch (err) {
            console.error("Error fetching token:", err);
            setIsLoggedIn(false);
            setLoggedInUserId(null);
          }
        }
          checkLogin()
          },[])
          console.log("THe isLoggedIn:",isLoggedIn)
          console.log("THe loggedInUserId is:- ",loggedInUserId)
  
    if(followerLoading){
      console.log("Ruk jaa abhi follower count load horha he");
    }
  
    if(followingLoading){
      console.log("Ruk jaa abhi following count load horha he");
    }
    if(followingLoading){
      console.log("Ruk jaa abhi following count load horha he");
    }
    if(followerError){
      console.log("Error as gya tery follower count me");
    }
    if(deleteLoading){
      console.log("Error as gya tery delete ACCOUNT  me");
    }
  
    if (error) {
      console.error("GraphQL Error:", error.graphQLErrors);
      console.error("Network Error:", error.networkError);
      console.error("Apollo Full Error:", error);
    }
  
    const handleChange=(e)=>{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value
      
      })
    }
    const handleSubmit= async(e)=>{
      e.preventDefault();
        try{
      await editProfile({
        variables: {
          editData: {
            ...formData,
            profile_pic: publicId
          }
        }
      });
      console.log("Form Data Being Sent:", {
        ...formData,
        profile_pic: publicId
      });
        toast("Profile updated successfully.")
        setFormData({});
        setPublicId("");
    
    }
    catch (error) {
      console.error("Detailed error:", error);
      toast.error(error.message || "Failed to update profile");
    }
  }
  const handleLogout = async () => {
    const res=await fetch('/api/logout',{
      method: 'POST',
      credentials: 'include',
    }); 
    console.log("Logout status:", res.status);
  
    console.log("The restooo is:- ",res)// trigger cookie removal
    window.location.href = '/login'; 
  };
  const handleDeleteButton = async () => {
    try {
      const { data } = await deleteAccount(); // call the mutation
      toast.success("Account deleted successfully.");
      handleLogout()
      
      // Optional: redirect or clean up
      router.push("/"); 
  
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error.message || "Failed to delete account.");
    }
  };
  
      return (
        <>
        
          <div className="min-h-screen lg:py-20 py-16 sm:py-20 md:py-20  xl:py-20 2xl:py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
          {targetUserLoading && (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  )}
  
          {loading && (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      {/* Text */}
      <p className="mt-4 text-gray-600 text-sm font-medium">Updating your profile...</p>
    </div>
  )}
  
        <div className="max-w-2xl mx-auto  space-y-6">
  
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-500">Manage your profile information and account settings</p>
          </div>
  
          {/* Profile Image */}
          <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
          <div className="flex justify-center">
    <div className={`w-16 h-16 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition-all rounded-full overflow-hidden ${publicId ? 'border-none':'border-2 border-indigo-600'}`}>
      {publicId ? (
        <CldImage 
          src={publicId} 
          alt={publicId} 
          width={64} 
          height={64} 
          className="w-full h-full object-cover"
        />
      ) : <CldUploadWidget uploadPreset="qea5a4ju"
      onSuccess={({ event, info }) => {
        if (event === "success") {
          setPublicId(info?.secure_url); // save uploaded image URL
        }
      }}
    >
      {({ open }) => (
        <>
          {!publicId && (
            <div className="w-6 h-6 flex items-center justify-center">
  
            <FontAwesomeIcon
            icon={faPlus}
            onClick={(e) => {
              e.preventDefault();
              open(); // opens upload dialog
            }}
            className="text-indigo-600 text-2xl" // changed from text-[36px] to text-xl (Tailwind default)
          />
          </div>
          )}
        </>
      )}
    </CldUploadWidget>
    }
    </div>
  </div>
  
  
  
  
    <div className="mt-2 flex flex-col items-center">
      {/* <button className="text-indigo-600 text-md font-medium hover:underline cursor-pointer">
        Change Photo
      </button> */}
  
  
  <CldUploadWidget
    uploadPreset="qea5a4ju"
    onSuccess={({ event, info }) => {
      if (event === "success") {
        setPublicId(info?.secure_url); // ✅ full image URL that works in frontend & backend
      }
    }}
  >
    {({ open }) => (
      <button
        type="button"
        className="text-indigo-600 text-md font-medium hover:underline cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          open();
        }}
      >
        Upload Photo
      </button>
    )}
  </CldUploadWidget>
  
  
  
      <p className="text-xs text-gray-400 mt-1">JPG, PNG, or GIF (max 2MB)</p>
    </div>
  </div>
          
  
          {/* Personal Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Personal information</h2>
  
            <div>
              <label className="block text-sm text-gray-600">Full Name</label>
              <input type="text" onChange={handleChange} value={formData.full_name || ""}
    name='full_name' className="mt-1  focus:ring-indigo-500  w-full px-3 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB]
              " />
            </div>
  
            <div>
              <label className="block text-sm text-gray-600">Username</label>
              <input type="text"   value={formData.username || ""}
      onChange={handleChange} name='username' className="mt-1  focus:ring-indigo-500 w-full px-3 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB]
              " />
            </div>
  
            <div>
              <label className="block text-sm text-gray-600">Email Address</label>
              <input type="email" name='email_address' onChange={handleChange}   value={formData.email_address || ""}
    className="mt-1 focus:ring-indigo-500 w-full px-3 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB]
              " />
            </div>
  
            <div>
              <label className="block text-sm text-gray-600">Bio</label>
              <textarea
                
                rows="3"
                name='about_Us'
                onChange={handleChange}
                value={formData.about_Us || ""}
                className="mt-1 focus:ring-indigo-500 w-full px-3 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB] "
              ></textarea>
            </div>
          </div>
  
          {/* Social Links */}
          <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
            <h2 className="text-sm font-semibold text-gray-700">Social Links</h2>
  
            <div className="flex items-center gap-2">
              <FaTwitter className="text-gray-500" />
              <input value={formData.twitter_link || ""}
   name='twitter_link' onChange={handleChange} type="text"  className="w-full px-3 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB]" />
            </div>
  
            <div className="flex items-center gap-2">
              <FaLinkedin 
   className="text-gray-500" />
              <input name='linkedin_link' value={formData.linkedin_link || ""} onChange={handleChange}   type="text"  className="w-full px-3 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB]" />
            </div>
  
            <div className="flex items-center gap-2">
              <FaGithub 
   className="text-gray-500" />
              <input name='github_link' value={formData.github_link || ""} onChange={handleChange} type="text"  className="w-full px-3 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB]" />
            </div>
          </div>
  
          {/* Stats */}
          <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
            <div className="text-center">
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-xl font-semibold text-gray-900">
    {followerLoading
      ? "Loading..."
      : followerData?.getOurFollowerCount ?? 0}
  </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Following</p>
              <p className="text-xl font-semibold text-gray-900">
              {followingLoading
      ? "Loading..."
      : followingData?.getOurFollowingCount ?? 0}
              </p>
            </div>
          </div>
  
          {/* Save / Cancel Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
          <button
    type="submit"
    disabled={loading}
    className={`  cursor-pointer  transition-all w-full bg-indigo-600 text-white py-2 rounded-md ${
      loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
    }`}
  >
    {loading ? 'Saving...' : 'Save Changes'}
  </button>
  
  
  
  
  
  
            <button className="w-full bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 cursor-pointer  transition-all">Cancel</button>
          </div>
          </form>
  
          {/* Delete Account */}
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">⚠️ Delete Account</p>
            <p className="mb-3">Once you delete your account, there is no going back. Please be certain.</p>
            <Dialog>
    <DialogTrigger asChild>
      <button className="bg-red-600 text-white cursor-pointer transition-all px-4 py-2 rounded-md hover:bg-red-700 text-sm">
        Delete Account
      </button>
    </DialogTrigger>
  
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Are you absolutely sure?</DialogTitle>
        <DialogDescription>
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </DialogDescription>
      </DialogHeader>
  
      <DialogFooter className="flex justify-end gap-3 mt-4">
        <DialogClose asChild>
            <div>
        <Button
    variant="outline"
    className="cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100"
  >
    No, Keep My Account
  </Button> 
  </div>     
  </DialogClose>
  
        <DialogClose asChild>
          <div>
          <Button
            variant="destructive"
            onClick={handleDeleteButton}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Yes, Delete It"}
          </Button>
          </div>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
  
          </div>
        </div>
      </div>
      </>
  
      )
}

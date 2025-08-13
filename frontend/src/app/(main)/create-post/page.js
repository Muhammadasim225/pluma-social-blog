"use client"
import React from 'react';
// import { useState } from 'react';
import { useState,useEffect } from 'react';
import { FaCloudUploadAlt, FaExclamationCircle } from 'react-icons/fa';
import { CldImage, CldUploadWidget } from 'next-cloudinary';
import { useMutation } from '@apollo/client';
import { CREATE_BLOG } from '../../../../gqlOperations/mutations';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"
import ReactMarkdown from 'react-markdown';
import Skeleton from 'react-loading-skeleton'
import { GET_ALL_POSTS, GET_FOLLOWING_USER_POST, GET_TRENDING_POSTS } from '../../../../gqlOperations/queries';


export default function CreatePost(){
  const router=useRouter();
  const [publicId,setPublicId]=useState("")
  const [create_blog,{data,loading,error}]=useMutation(CREATE_BLOG, {
    refetchQueries: [{ query: GET_ALL_POSTS},
      {query:GET_FOLLOWING_USER_POST},
      {query:GET_TRENDING_POSTS}
    ],
    awaitRefetchQueries: true, // optional, ensures refetch completes before continuing
  })
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput,setTagInput]=useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [markDown,setMarkDown]=useState("")
  const [activeTab, setActiveTab] = useState('write');


  if (error) {
    console.log("GraphQL Errors:", error.graphQLErrors);
    console.log("Network Error:", error.networkError);
    console.log("Full Error:", error);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      await create_blog({
        variables: {
          insertContent: {
            title,
            description: content,
            cover_img: publicId,
            text: tags
          }
        }
      });

      console.log("Mutation variables:", {
        insertContent: {
          title,
          description: content,
          cover_img: publicId,
          text:tags        
      }
      });
      toast("Post published successfully")

      setErrorMessage(''); // Clear any previous error
      // Optionally reset the form
      setTitle('');
      setContent('');
      setPublicId('');
      setMarkDown("")
      setTags([]);

    } catch (err) {
      console.log("Error publishing post:", err);
    }
  };

  // const handlePreviewClick=()=>{
  //   setToggle(!toggle)
  // }

  
    
    return (
      <>
    <div className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8 lg:px-36 xl:px-52 relative">

    {loading && (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
    {/* Spinner */}
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
    {/* Text */}
    <p className="mt-4 text-gray-600 text-sm font-medium">Publishing your post...</p>
  </div>
)}
          <form onSubmit={handleSubmit}>
        <h2 className="text-sm text-gray-500 mb-2">Create New Post</h2>
        <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  placeholder="Post title"
  className="w-full text-3xl font-semibold border-none bg-transparent placeholder-gray-400 focus:ring-0 focus:outline-none"
/>       


        <CldUploadWidget
  uploadPreset="qea5a4ju"
  onSuccess={({ event, info }) => {
    if (event === 'success') {
      setPublicId(info?.secure_url);
    }
  }}

>
  {({ open }) => {
    return (
      
      <div
        onClick={() => open()}
        className={`mt-6 border-2 border-dashed border-gray-300 rounded-md h-52 w-full flex items-center justify-center cursor-pointer ${publicId ? ('border-none'):('border-2 border-dashed border-gray-300')} hover:bg-gray-100`}
      >
        {publicId ? (
          <CldImage
            src={publicId}
            alt="Cover Image"
            width={800}
            height={200}
            className="w-full h-full object-cover rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center justify-center">
            <FaCloudUploadAlt className="text-3xl text-gray-400" />
            <span className="mt-2 text-gray-500 text-sm">Click to add cover image</span>
          </div>
        )}
      </div>
    );
  }}
</CldUploadWidget>

        {/* Tabs */}
        <div className="mt-6 ">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
  <button
    type="button"
    onClick={() => setActiveTab('write')}
    onChange={(e)=>setMarkDown(e.target.value)}
    value={markDown}
    className={`
      whitespace-nowrap cursor-pointer pb-2 px-1 font-medium text-sm
      border-b-2
      ${activeTab === 'write'
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'}
    `}
  >
    Write
  </button>

  <button
    type="button"
    onClick={() => {
      setActiveTab('preview');
      setMarkDown(content); // <-- sync content to markdown before preview
    }}
    className={`
      whitespace-nowrap pb-2 px-1 font-medium text-sm
      border-b-2 cursor-pointer
      ${activeTab === 'preview'
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-gray-500 hover:text-gray-700'}
    `}
  >
    Preview
  </button>
</nav>
        </div>
  
        {/* Post Content */}
        <div className="mt-4">
          {
            activeTab==='write' && (  <textarea
              rows="12"
              value={content}
              name='description'
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your post..."
              className="w-full p-4 resize-none focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 rounded-md border-2 border-[#E5E7EB]"
            ></textarea>)
          }
       {
        activeTab === 'preview' && (
          <div className='prose prose-indigo max-w-none p-4 rounded-md w-full border-2 border-indigo-500'>
            <ReactMarkdown>{markDown}</ReactMarkdown>
          </div>
        )
       }
        </div>
  
        {/* Tags */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag, idx) => (
              <span 
                key={idx}
                className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <input
  type="text"
  value={tagInput}
  name='text'
  onChange={(e) => setTagInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      if (tags.length < 4 && !tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  }}
  placeholder="Add up to 4 tags... (Press Enter)"
  className="w-full px-4 py-2 rounded-md border-2 border-[#E5E7EB] focus:outline-none focus:border-indigo-500"
/>
        </div>
  
        {/* Warning Message */}
        {errorMessage && (
  <div className="mt-4 text-red-600 bg-red-100 px-4 py-3 rounded-md text-sm flex items-center gap-2">
    <FaExclamationCircle className="text-red-500" />
    {errorMessage}
  </div>
)}
        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <p>0 words • 0 min read</p>
          <div className="flex gap-3">
            <button className=" cursor-pointer transition-all lg:px-4 lg:py-2 md:px-4 md:py-2 sm:px-4 sm:py-2  text-gray-500 hover:underline">Cancel</button>
            <button className=" cursor-pointer transition-alllg:px-4 lg:py-2 md:px-4 md:p y-2 sm:px-4 sm:py-2  px-3 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200">Save Draft</button>
            <button className="cursor-pointer  transition-all lg:px-4 lg:py-2 md:px-4 md:py-2 sm:px-4 sm:py-2 px-3 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700">Publish</button>
          </div>
        </div>
        </form>
      </div>
      </>


    )
}
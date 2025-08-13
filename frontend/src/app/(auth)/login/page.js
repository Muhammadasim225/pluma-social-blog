"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faGithub } from '@fortawesome/free-brands-svg-icons';
import pen_pencil from '../../../../public/FRAME (2).png'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { LOGIN_USER } from '../../../../gqlOperations/mutations';
import {CheckCircle2Icon } from "lucide-react"
import { toast } from "sonner"

export default function Login(){
  const router=useRouter();
  const [formData,setFormData]=useState({})
  const [loginUser,{data,loading,error}]=useMutation(LOGIN_USER)


  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    
    })
  }

  const handleSubmit=(e)=>{
  
      e.preventDefault();
    
      loginUser({
        variables:{
          registeredUser: {
            email_address: formData.email_address,
            password: formData.password
          }
              }
      })
      toast("login Successfull")
      router.push('/')
    }
  
 
  
    if (loading) {
      return <h1>Loading...</h1>;
    }
  
    if (error) {
      console.log("GraphQL Errors:", error.graphQLErrors);
      console.log("Network Error:", error.networkError);
      console.log("Full Error:", error);
    }

  const google=()=>{
    window.open("http://localhost:5000/auth/google","_self")

  }
  const github=()=>{
    window.open("http://localhost:5000/auth/github","_self")

  }
    return (
        <>

           <div className="navbar pt-5 pl-5 bg-gray-50 ">
            <nav>
            <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-600 rounded-md" />
            <span className="text-indigo-600 font-semibold text-2xl">
              <Link href="/">Pluma</Link>
            </span>
          </div>
            </nav>
          </div>
        
        <div className=" mt-16 md:mt-0 lg:mt-0 sm:mt-0 min-h-screen lg:bg-gray-50 md:bg-gray-50 xl:bg-gray-50 2xl:bg-gray-50 flex flex-col items-center justify-center px-4 lg:py-10 md:py-10 xl:py-10 2xl:py-10 sm:py-10 py-0 sm:px-6 lg:px-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 lg:gap-10 md:gap-10 xl:gap-10 2xl:gap-10  gap-2   items-center">
  
          {/* Left Side - Welcome Message */}
          <div className="text-center lg:text-center px-4">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-500">Log in to continue your writing journey</p>
            <div className=" hidden lg:flex flex-col items-center justify-center mt-6 relative ">
              <Image
                src={pen_pencil}
                alt="Pen writing"
                className="rounded-lg w-full h-96 object-cover mx-auto"
              />
            </div>
            <p className="hidden mt-6 font-semibold text-indigo-600 text-lg">Write. Share. Connect.</p>
          </div>
  
          {/* Right Side - Login Form */}
          <div className="bg-white rounded-xl px-8 lg:py-10 md:py-10 xl:py-10 2xl:py-10 sm:py-10 py-10 w-full max-w-md mx-auto  lg:shadow-md md:shadow-md xl:shadow-md 2xl:shadow-md">
            <h2 className="text-xl font-bold text-gray-900 mb-1">Log in to your account</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your credentials to access your account</p>
  
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <input
                  type="email"
                  name="email_address"
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Enter your password"
                  />
                  <span className="absolute right-3 top-3.5 text-gray-400 cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5.25 12 5.25c4.478 0 8.268 2.693 9.542 6.75-1.274 4.057-5.064 6.75-9.542 6.75-4.477 0-8.268-2.693-9.542-6.75z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-600 hover:underline font-medium">Forgot password?</a>
              </div>
              <button
                type="submit"
                className=" transition-all cursor-pointer w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium"
              >
                Log in
              </button>
            </form>
  
            <div className="mt-6 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
  
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
  <button onClick={google}  className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
    <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 text-gray-700" />
    Google
  </button>
  <button onClick={github} className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
    <FontAwesomeIcon icon={faGithub} className="w-4 h-4 text-gray-700" />
    GitHub
  </button>
</div>
  
            <p className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account? <Link href="/signup" className="text-indigo-600 hover:underline font-medium">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
      </>

    )
}
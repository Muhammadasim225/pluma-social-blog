"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle,faGithub } from '@fortawesome/free-brands-svg-icons';
import laptop from '../../../../public/laptop.jpg'
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import '../../globals.css'
import { useMutation } from '@apollo/client';
import { SIGNUP_USER } from '../../../../gqlOperations/mutations';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {CheckCircle2Icon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

export default function Signup(){
  const [showAlert, setShowAlert] = useState(false);
  const router=useRouter()


  const [formData,setFormData]=useState({})
  const [signupUser,{data,loading,error}]=useMutation(SIGNUP_USER)

  const google=()=>{
    window.open("http://localhost:5000/auth/google","_self")

  }
  const github=()=>{
    window.open("http://localhost:5000/auth/github","_self")

  }
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.name]:e.target.value
    
    })
  }

  const handleSubmit=(e)=>{

    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      alert("Passwords do not match");
      return;
    }
    signupUser({
      variables:{
        userNew: {
          full_name: formData.full_name,
          email_address: formData.email_address,
          password: formData.password
        }
            }
    })
      setShowAlert(true);
  }

  useEffect(() => {
    if (showAlert) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false)
        router.push('/login') // ⬅️ Redirect after 3 seconds
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [showAlert,router])

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    console.log("GraphQL Errors:", error.graphQLErrors);
    console.log("Network Error:", error.networkError);
    console.log("Full Error:", error);
  }
    return (
      <>
    {showAlert && (
        <div className="fixed top-5 right-5 z-50">
          <Alert>
            <CheckCircle2Icon className="text-green-500" />
            <AlertTitle className="text-green-500">Account Created</AlertTitle>
            <AlertDescription>
              You&apos;re successfully signed up. Redirecting to login...
            </AlertDescription>
          </Alert>
        </div>
      )}
      <div className="navbar pt-5 pl-5 lg:bg-gray-50 md:bg-gray-50 xl:bg-gray-50 2xl:bg-gray-50  ">
            <nav>
            <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-600 rounded-md" />
            <span className="text-indigo-600 font-semibold text-2xl">
              <Link href="/">Pluma</Link>
            </span>
          </div>
            </nav>
          </div>
        <div className="min-h-screen flex items-center justify-center px-4 lg:bg-gray-50 md:bg-gray-50 xl:bg-gray-50 2xl:bg-gray-50 lg:py-10 md:py-10 xl:py-10 2xl:py-10 sm:py-10 py-10 sm:px-6 lg:px-8">
          
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left Side - Image & Quote */}
        <div className="hidden lg:flex flex-col items-center justify-center">
          <Image
            src={laptop}
            alt="Signup Visual"
            className="rounded-xl shadow-lg"
          />
          <div className="mt-8 text-center">
            <h2 className="text-xl font-semibold text-gray-800">Join the community of writers and readers</h2>
            <p className="text-gray-500 mt-2">&quot;GraphBlog helped me reach thousands of readers with my technical content&quot;</p>
            <div className="mt-4 flex items-center justify-center gap-2">
            <Image
  src="https://randomuser.me/api/portraits/women/68.jpg"
  alt="Sarah Chen"
  width={40}
  height={40}
  className="h-10 w-10 rounded-full"
/>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-800">Sarah Chen</p>
                <p className="text-sm text-gray-500">Tech Writer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="bg-white lg:py-10 md:py-10 xl:py-10 2xl:py-10 sm:py-10 py-0 px-6 sm:px-10 lg:shadow-md md:shadow-md xl:shadow-md 2xl:shadow-md rounded-xl w-full">
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1">Start your writing journey today</p>

          <form  onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                onChange={handleChange}
                name="full_name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                type="email"
                onChange={handleChange}
                name='email_address'
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Create a password"
              />
              <p className="text-sm text-green-600 mt-1">Password strength: Strong</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                name='confirm_password'
                onChange={handleChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Confirm your password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer transition-all"
            >
              Create Account
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-4">
  <button onClick={google} className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
    <FontAwesomeIcon icon={faGoogle} className="w-4 h-4 text-gray-700" />
    Google
  </button>
  <button onClick={github} className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
    <FontAwesomeIcon icon={faGithub} className="w-4 h-4 text-gray-700" />
    GitHub
  </button>
</div>


          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
    </>

    )
}
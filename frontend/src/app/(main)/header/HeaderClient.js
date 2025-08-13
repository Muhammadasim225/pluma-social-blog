'use client';
import Link from 'next/link';
import React, { useEffect } from "react";
import { Search,Menu , X} from 'lucide-react';
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
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



export default function HeaderClient() {
    const searchParams = useSearchParams();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathName=usePathname()
    const router=useRouter()
    const [isLoggedIn,setIsLoggedIn]=useState(null);
    const [searchInput,setSearchInput]=useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedSearchTerm(searchInput);
      }, 1000); // Debounce delay of 400ms
    
      return () => {
        clearTimeout(handler); // Cleanup on next keystroke
      };
    }, [searchInput]);
  
    useEffect(() => {
      if (debouncedSearchTerm.trim()) {
        router.push(`/search-result?query=${encodeURIComponent(debouncedSearchTerm.trim())}`);
      }
    }, [debouncedSearchTerm,router]);





  useEffect(() => {
    async function hello() {
      try {
        const res = await fetch("/api/test-token", {
          method: 'GET',
          credentials: 'include', // ✅ important to include cookies
        });
        const data = await res.json();
        console.log("Token check response:", data);
  
        if (data?.cookies) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error fetching token:", err);
        setIsLoggedIn(false);
      }
    }
    
    hello();
  }, []);
  
  

  const handleLogout = async () => {
    const res=await fetch('/api/logout',{
      method: 'POST',
      credentials: 'include',
    }); 
    console.log("Logout status:", res.status);

    console.log("The restooo is:- ",res)// trigger cookie removal
    window.location.href = '/login'; 
    setIsLoggedIn(false)// or router.push('/login');
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        router.push(`/search-result?query=${encodeURIComponent(query)}`);
      }
    }
  };

    
  
  
  return (
    <header className=" sticky top-0 z-50 bg-white w-full px-4 md:px-8 py-3 shadow-sm border-b-gray-600 ">
    <nav className="max-w-7xl mx-auto flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-indigo-600 rounded-md" />
        <span className="text-indigo-600 font-semibold text-2xl">
          <Link href="/">Pluma</Link>
        </span>
      </div>

      {/* Search - Desktop */}
      <div className="hidden md:flex flex-1 mx-6 max-w-md relative">
        
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
        <input
          type="text"
            value={searchInput}
          placeholder="Search articles, topics, or authors..."
          onChange={(e)=>setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500  rounded-md border-2 border-[#E5E7EB] text-sm placeholder-gray-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-8">
      {isLoggedIn === null ? (
// While checking token, show a placeholder or nothing

<></>) :isLoggedIn && (
        <>
          <Link href="/create-post">
            <button className="cursor-pointer hidden md:inline-flex text-gray-700 hover:text-indigo-600 text-md">
              Write
            </button>
          </Link>
          <Link href="/own-profile">
            <button className="cursor-pointer hidden md:inline-flex text-gray-700 hover:text-indigo-600 text-md">
              Profile
            </button>
          </Link>
       
<Dialog>
{/* Trigger Button */}
<DialogTrigger asChild>
<button className="cursor-pointer hidden md:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition">
  Logout
</button>
</DialogTrigger>

{/* Dialog Content */}
<DialogContent className="sm:max-w-[425px]">
<DialogHeader>
  <DialogTitle>Are you sure you want to logout?</DialogTitle>
  <DialogDescription>
    You will need to log in again to access your account.
  </DialogDescription>
</DialogHeader>

<DialogFooter className="flex justify-end gap-3 mt-4">
  <DialogClose asChild>
    <Button variant="outline" className="cursor-pointer text-gray-700 border-gray-300 hover:bg-gray-100">
      Cancel
    </Button>
  </DialogClose>

  <DialogClose asChild>
    <Button variant="destructive" onClick={handleLogout}>
      Yes, Logout
    </Button>
  </DialogClose>
</DialogFooter>
</DialogContent>
</Dialog>

          
        </>
      )}


      {!isLoggedIn && (
        <>
          <Link href="/login">
            <button className="cursor-pointer hidden md:inline-flex text-gray-700 hover:text-indigo-600 text-md">
              Sign In
            </button>
          </Link>
          <Link href="/signup">
            <button className="cursor-pointer hidden md:inline-flex bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-md transition">
              Get Started
            </button>
          </Link>
        </>
      )}
      </div>
      <div className="md:hidden">
  <button
    onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
    className="text-gray-700 hover:text-indigo-600"
  >
    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
</div>
    </nav>

    {/* Mobile Slide-down Menu */}
     {isMobileMenuOpen && (
<div className="md:hidden px-4 pb-4 pt-6 space-y-4 animate-slide-down">
<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
  <input
    type="text"
    placeholder="Search articles, topics, or authors..."
    className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm placeholder-gray-500"
  />
</div>

{isLoggedIn ? (
  <>
    <button className="block w-full text-left text-gray-700 hover:text-indigo-600 text-md">
      Write
    </button>
    <button className="block w-full text-left text-gray-700 hover:text-indigo-600 text-md">
      Profile
    </button>
  </>
) : (
  <>
    <button className="block w-full text-left text-gray-700 hover:text-indigo-600 text-md">
      Sign In
    </button>
    <Link href="/signup">
      <button className="bg-indigo-600 block w-full hover:bg-indigo-700 text-white text-md text-center font-medium px-4 py-2 rounded-md transition">
        Get Started
      </button>
    </Link>
  </>
)}
</div>
)} 

  </header>
  );
}

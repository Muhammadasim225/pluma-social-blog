'use client'
import { ArrowLeft,Search,File } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense,useState } from "react";
import { useEffect } from "react";
import './globals.css'
import { useQuery } from "@apollo/client";
import { GET_POPULAR_POSTS } from "../../gqlOperations/queries";
function NotFoundContent() {
  const searchParams=useSearchParams()
    const pathName=usePathname()
    const router=useRouter()
    const [searchInput,setSearchInput]=useState("")
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const {data,loading,error}=useQuery(GET_POPULAR_POSTS)


    if(loading){
      console.log("THe loading is in not-found page");
    }
    if(error){
      console.log("THe error is in not-found page");
    }
    const articles = [
        {
          title: 'Getting Started with Pluma',
          author: 'Sarah Johnson',
          readTime: '5 min read',
        },
        {
          title: 'The Future of Web Development',
          author: 'Michael Chen',
          readTime: '8 min read',
        },
        {
          title: 'Building Scalable Applications',
          author: 'Alex Turner',
          readTime: '6 min read',
        },
      ];
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

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          const query = e.target.value.trim();
          if (query) {
            router.push(`/search-result?query=${encodeURIComponent(query)}`);
          }
        }
      };
    
    return(
        <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-gray-50 py-20">
        <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-6">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        <div className="p-10 w-48 h-48 flex items-center justify-center rounded-full bg-indigo-100 mb-6">
        <File className="w-52 h-52 text-indigo-500" />

        </div>
        <Link href="/">
  
        <button className="flex transition-all items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white text-sm font-medium rounded-md mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>
        </Link>
  
        <div className="relative w-full max-w-md mb-10">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            placeholder="Search articles, topics, or authors..."
            onChange={(e)=>setSearchInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
        </div>
  
        <div className="w-full max-w-4xl text-left">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {data?.posts.map((article) => (
              <div key={article.id} className="p-4 border border-gray-200 rounded-md bg-white">
                <h3 className="font-medium text-gray-900 text-sm mb-1">{article.title}</h3>
                <p className="text-xs text-gray-500">
                  {article.user.full_name} • {article.readTime} min read
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
  )
}


export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 text-center bg-gray-50 py-20">
      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-gray-500 mb-6">Oops! The page you&apos;re looking for doesn&apos;t exist.</p>

      {/* 👇 Wrap router logic in Suspense */}
      <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
       <NotFoundContent></NotFoundContent>
      </Suspense>
    </div>
  );
}
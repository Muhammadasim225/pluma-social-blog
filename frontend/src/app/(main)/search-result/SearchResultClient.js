"use client";
import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart,faClock } from '@fortawesome/free-solid-svg-icons';
import { useSearchParams } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { useQuery } from '@apollo/client';
import { SEARCH_RESULTS } from '../../../../gqlOperations/queries';
import removeMarkdown from 'remove-markdown';
import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
export default function SearchResultClient() {
    const searchParams=useSearchParams();
      const query = searchParams.get('query');
    
      const { data, loading, error, refetch } = useQuery(SEARCH_RESULTS, {
        variables: { keywords: query },
        skip: !query, // skip initial query if empty
      });
    
      useEffect(() => {
        if (query) {
          refetch({ keywords: query });
        }
      }, [query,refetch]);
    
    
  return (
    <>
    {loading && (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        {/* Text */}
      </div>
    )}
    {
      error && (<p className="text-gray-500 mt-2 max-w-md">
        Nothing found for &quot;{query}&quot;. You can try searching something else or write your own post.
      </p>
      )
    }
      <div className="p-6 max-w-screen-xl mx-auto my-10">
     <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
{/* Buttons Section */}


{/* Icons Section */}

</div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.searchPosts.map((article, index) => (
         <Link key={index} href={`/post-detail/${article.id}`} className="block">

          <div key={index} className="border-2 border-[#E5E7EB] rounded-lg overflow-hidden ">
            <Image src={article.cover_img} alt="Thumbnail" className=" w-full h-48  object-cover"   width={400} 
  height={192} />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
              <p className='text-[#6B7280] text-sm'>{removeMarkdown(article.description).length > 200
          ? removeMarkdown(article.description).slice(0, 120) + "..."
          : removeMarkdown(article.description)}</p>
              <div className="flex flex-row">
                  <div className="pic"></div>
                  <div className="desc flex flex-col">
                      <h1>{article.user.full_name}</h1>
                      <p>{new Date(article.createdAt).toLocaleDateString('en-US', {
  month: 'short',  // "Jul"
  day: 'numeric',  // "8"
  year: 'numeric'  // "2025"
})}</p>
                  </div>

              </div>
              <p className="text-sm text-[#6B7280] mb-3">{article.date} &middot; {article.readTime}</p>
              <div className="text-sm text-gray-700 flex items-center justify-between mb-3">
                  <span><FontAwesomeIcon icon={faClock} className="text-[#6B7280] text-md cursor-pointer mr-1" />{article.readTime}</span>
                <span className='text-[#6B7280]'><FontAwesomeIcon
                      icon={faHeart}
                      className="text-[#6B7280] text-md cursor-pointer"
                    /> {article.likesCount}</span>
                <span className=" inline-flex items-center space-x-1 text-[#6B7280] cursor-pointer">
<MessageCircle className="w-4 h-4 text-[#6B7280]" />
<span className='text-[#6B7280]'>{article.commentCount}</span>
</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, i) => (
                  <span key={i} className="text-xs px-2 py-1 bg-gray-100 rounded-full text-[#6B7280]">{tag.text}</span>
                ))}
              </div>
            </div>
          </div>
          </Link>
        ))}
      </div>

     
    </div>
    </>
  );
}

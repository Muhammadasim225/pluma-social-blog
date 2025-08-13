"use client"
import React, { Suspense } from 'react';
import HeaderClient from './HeaderClient';

export default function Header(){


    return(
      <Suspense fallback={
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
          {/* Spinner */}
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      }>
      
            {/* Footer */}
            <HeaderClient></HeaderClient>
      
            </Suspense>
    
                


    )
}
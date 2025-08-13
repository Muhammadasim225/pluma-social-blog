"use client"
import { Suspense,React } from "react"
import SearchResultClient from "./SearchResultClient"
export default function SearchResult(){


    return (<>
     <Suspense fallback={<div>Loading...</div>}>
      <SearchResultClient />
    </Suspense>
    
      </>
    
    )
  }
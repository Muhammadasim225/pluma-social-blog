"use client"
import React, { Suspense } from 'react';
import FooterClient from './FooterClient';
export default function Footer(){
    return (
       
<>
<Suspense fallback={<div>Loading...</div>}>

      {/* Footer */}
      <FooterClient></FooterClient>

      </Suspense>

      </>

    )
}
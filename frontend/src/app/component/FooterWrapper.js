'use client';
import FooterClient from '../(main)/footer/FooterClient';
import React, { Suspense } from 'react';

export default function FooterWrapper() {
  return (
    <Suspense fallback={<div>Loading footer...</div>}>
      <FooterClient />
    </Suspense>
  );
}

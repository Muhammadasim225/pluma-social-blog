'use client';

import React, { Suspense } from 'react';
import HeaderClient from '../(main)/header/HeaderClient';
export default function HeaderWrapper() {
  return (
    <Suspense fallback={<div>Loading header...</div>}>
      <HeaderClient />
    </Suspense>
  );
}

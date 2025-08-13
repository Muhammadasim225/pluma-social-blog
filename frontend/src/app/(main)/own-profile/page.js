import { Suspense } from 'react';
import OwnProfileClient from './OwnProfileClient';

export const dynamic = "force-dynamic"; // Optional, to avoid static optimization

export default function OwnProfilePage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white bg-opacity-70 backdrop-blur-sm">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    }>
      <OwnProfileClient />
    </Suspense>
  );
}

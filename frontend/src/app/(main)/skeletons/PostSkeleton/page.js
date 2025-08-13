export default function PostSkeleton() {
  return (

  <div className=" bg-white rounded-xl shadow-sm overflow-hidden animate-pulse z-10">
      {/* Author */}
      <div className="p-5 flex items-center gap-3">
        <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
  
      {/* Image */}
      <div className="w-full h-64 bg-gray-300"></div>
  
      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
  
        {/* Tags */}
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-14 bg-gray-200 rounded"></div>
          <div className="h-6 w-12 bg-gray-200 rounded"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
  
        {/* Actions */}
        <div className="flex gap-6 mt-6">
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
          <div className="h-5 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  )};
  
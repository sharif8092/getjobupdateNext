export default function Loading() {
  return (
    <div className="w-full flex flex-col font-sans bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-64 bg-slate-200 rounded animate-pulse mb-6"></div>
        
        {/* Main Header / Title Skeleton */}
        <div className="space-y-4 mb-10">
          <div className="h-10 w-3/4 md:w-2/3 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-10 w-1/2 md:w-1/3 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="flex gap-4 mt-4">
            <div className="h-6 w-24 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick Meta Card Skeleton */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between border-b border-slate-50 pb-2">
                    <div className="h-4 w-1/3 bg-slate-200 rounded animate-pulse"></div>
                    <div className="h-4 w-1/4 bg-slate-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Body Skeletons */}
            <div className="space-y-6 bg-white p-6 md:p-8 rounded-2xl border border-slate-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className={`h-6 bg-slate-200 rounded animate-pulse ${i % 2 === 0 ? 'w-1/3' : 'w-1/4'}`}></div>
                  <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
                  <div className={`h-4 bg-slate-100 rounded animate-pulse ${i % 3 === 0 ? 'w-5/6' : 'w-4/5'}`}></div>
                </div>
              ))}
            </div>

          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse mb-4"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <div className="h-6 w-1/2 bg-slate-200 rounded animate-pulse mb-4"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex flex-col gap-2 p-3 bg-slate-50 rounded-xl">
                  <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="w-full flex flex-col font-sans bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        
        {/* Header Skeleton */}
        <div className="flex flex-col items-center justify-center space-y-4 mb-8">
          <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse"></div>
          <div className="h-10 w-2/3 md:w-1/2 bg-slate-200 rounded-lg animate-pulse"></div>
          <div className="h-4 w-1/3 bg-slate-200 rounded-md animate-pulse"></div>
        </div>

        {/* Categories Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 animate-pulse shrink-0"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 w-full bg-slate-200 rounded animate-pulse"></div>
                <div className="h-2 w-1/2 bg-slate-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Area Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-6">
          {/* Left Column (Main Feed) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-72">
                  <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-700 animate-pulse"></div>
                      <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-4 space-y-4">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex flex-col gap-2">
                        <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-3 w-2/3 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
              <div className="h-5 w-1/2 bg-slate-200 rounded animate-pulse mb-6"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-slate-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}

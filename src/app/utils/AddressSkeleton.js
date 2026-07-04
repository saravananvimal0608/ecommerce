const AddressSkeleton = () => {
  return (
    <div className="min-h-screen common-bg px-4 py-16 sm:py-24 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div>
            <div className="h-7 w-40 bg-white/10 rounded mb-2"></div>
            <div className="h-4 w-28 bg-white/10 rounded"></div>
          </div>
          <div className="h-10 w-full sm:w-32 bg-white/10 rounded-xl"></div>
        </div>

        {/* Address Cards */}
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <div className="space-y-3 flex-1">
                <div className="h-5 w-48 bg-white/10 rounded"></div>
                <div className="h-4 w-full sm:w-72 bg-white/10 rounded"></div>
                <div className="h-4 w-36 bg-white/10 rounded"></div>
                <div className="h-4 w-28 bg-white/10 rounded"></div>
              </div>
              <div className="flex gap-2 sm:flex-col">
                <div className="h-8 flex-1 sm:flex-none sm:w-20 bg-white/10 rounded-lg"></div>
                <div className="h-8 flex-1 sm:flex-none sm:w-20 bg-white/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Form Skeleton */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6">
          <div className="h-6 w-36 bg-white/10 rounded mb-5"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((field) => (
              <div key={field} className={field === 1 || field === 6 ? "col-span-1 sm:col-span-2" : ""}>
                <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
                <div className="h-12 w-full bg-white/10 rounded-xl"></div>
              </div>
            ))}
            <div className="col-span-1 sm:col-span-2 flex gap-3 mt-2">
              <div className="flex-1 h-12 bg-white/10 rounded-xl"></div>
              <div className="flex-1 h-12 bg-white/10 rounded-xl"></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AddressSkeleton;
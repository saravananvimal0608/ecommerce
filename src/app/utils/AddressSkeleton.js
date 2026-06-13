const AddressSkeleton = () => {
  return (
    <div className="min-h-screen common-bg px-4 py-24 animate-pulse">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-white/10 rounded mb-2"></div>
            <div className="h-4 w-32 bg-white/10 rounded"></div>
          </div>

          <div className="h-10 w-32 bg-white/10 rounded-xl"></div>
        </div>

        {/* Address Cards */}
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
          >
            <div className="flex justify-between">
              <div className="space-y-3 flex-1">
                <div className="h-5 w-52 bg-white/10 rounded"></div>
                <div className="h-4 w-72 bg-white/10 rounded"></div>
                <div className="h-4 w-40 bg-white/10 rounded"></div>
                <div className="h-4 w-32 bg-white/10 rounded"></div>
              </div>

              <div className="flex gap-2">
                <div className="h-8 w-20 bg-white/10 rounded-lg"></div>
                <div className="h-8 w-20 bg-white/10 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Form Skeleton */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <div className="h-6 w-40 bg-white/10 rounded mb-6"></div>

          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((field) => (
              <div
                key={field}
                className={field === 1 || field === 6 ? "col-span-2" : ""}
              >
                <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
                <div className="h-12 w-full bg-white/10 rounded-xl"></div>
              </div>
            ))}

            <div className="col-span-2 flex gap-3 mt-3">
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
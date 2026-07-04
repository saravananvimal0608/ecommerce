import Skeleton from "react-loading-skeleton";

const SkeletonLoader = ({ variant }) => {

  if (variant === "banner") {
    return (
      <div className="h-[55vw] min-h-[280px] max-h-screen w-full">
        <Skeleton height="100%" />
      </div>
    );
  }

  if (variant === "product") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="border rounded-lg p-3">
            <Skeleton height={160} />
            <Skeleton height={18} className="mt-3" />
            <Skeleton height={14} width="80%" />
            <Skeleton height={22} width="40%" className="mt-2" />
            <Skeleton height={36} className="mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "thumbs") {
    return (
      <div>
        <Skeleton height={192} className="sm:!h-64 md:!h-80" />
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} height={56} className="sm:!h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "category") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex flex-col items-center bg-white rounded-2xl p-4 sm:p-6 shadow-xl">
            <Skeleton circle width={80} height={80} />
            <Skeleton height={18} width={90} className="mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "productPage") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md p-3">
            <Skeleton height={160} className="sm:!h-56" />
            <Skeleton height={18} className="mt-3" />
            <Skeleton height={14} width="70%" />
            <Skeleton count={2} className="mt-2" />
            <div className="flex justify-between mt-3">
              <Skeleton width={70} height={22} />
              <Skeleton width={55} height={28} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "singleProduct") {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-12">
        {/* Mobile layout */}
        <div className="block sm:hidden space-y-4">
          <Skeleton height={300} />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={60} width={60} />
            ))}
          </div>
          <Skeleton height={28} width="80%" />
          <Skeleton height={20} width={140} />
          <Skeleton height={36} width={110} />
          <Skeleton count={3} />
          <div className="flex gap-3 mt-4">
            <Skeleton height={48} width="100%" />
            <Skeleton height={48} width="100%" />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:grid grid-cols-12 gap-8">
          <div className="col-span-1 flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={64} width={64} />
            ))}
          </div>
          <div className="col-span-5">
            <Skeleton height={500} />
          </div>
          <div className="col-span-6 space-y-4">
            <Skeleton height={20} width={120} />
            <Skeleton height={40} width="80%" />
            <Skeleton height={20} width={150} />
            <Skeleton height={40} width={120} />
            <Skeleton count={3} />
            <Skeleton height={20} width="60%" />
            <Skeleton height={20} width="50%" />
            <div className="flex gap-3 mt-4">
              <Skeleton height={50} width="100%" />
              <Skeleton height={50} width="100%" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} height={100} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Skeleton height={28} width={180} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} height={220} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === "cart") {
    return (
      <div className="max-w-7xl mx-auto pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <Skeleton height={30} width={200} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl border p-3 sm:p-4 flex gap-3 sm:gap-4">
                <Skeleton width={80} height={80} className="sm:!w-28 sm:!h-28 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton height={18} width="70%" />
                  <Skeleton count={2} className="mt-2" />
                  <div className="flex justify-between mt-3">
                    <Skeleton width={70} height={22} />
                    <Skeleton width={90} height={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border p-4 sm:p-6 h-fit">
            <Skeleton height={28} width={160} />
            <div className="mt-4 space-y-3">
              <Skeleton height={18} />
              <Skeleton height={18} />
              <Skeleton height={18} />
            </div>
            <Skeleton height={44} className="mt-5" />
            <Skeleton height={18} width="60%" className="mt-3" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "checkout") {
    return (
      <div className="max-w-7xl mx-auto pt-16 sm:pt-24 pb-12 px-4 sm:px-6">
        <Skeleton height={30} width={180} className="mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl p-4 sm:p-6">
              <Skeleton height={22} width={160} className="mb-4" />
              {[1, 2].map((_, i) => (
                <div key={i} className="border rounded-xl p-4 mb-3">
                  <Skeleton height={16} width="60%" />
                  <Skeleton height={13} width="40%" className="mt-2" />
                  <Skeleton height={13} width="30%" className="mt-2" />
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-4 sm:p-6">
              <Skeleton height={22} width={160} className="mb-4" />
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-3 mb-4">
                  <Skeleton height={60} width={60} />
                  <div className="flex-1">
                    <Skeleton height={16} width="70%" />
                    <Skeleton height={13} width="50%" className="mt-2" />
                  </div>
                  <Skeleton height={16} width={60} />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 h-fit">
            <Skeleton height={22} width={140} className="mb-4" />
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex justify-between mb-3">
                <Skeleton height={14} width={110} />
                <Skeleton height={14} width={50} />
              </div>
            ))}
            <Skeleton height={1} className="my-4" />
            <div className="flex justify-between mb-4">
              <Skeleton height={18} width={90} />
              <Skeleton height={18} width={70} />
            </div>
            <Skeleton height={48} borderRadius={9999} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "userProfile") {
    return (
      <div className="min-h-screen common-bg px-4 py-16 sm:py-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/5 rounded-3xl p-4 sm:p-6 mb-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <Skeleton circle width={72} height={72} />
            <div className="flex-1 w-full">
              <Skeleton width={160} height={22} />
              <Skeleton width={220} height={16} className="mt-2" />
              <Skeleton width={80} height={18} className="mt-2" />
            </div>
            <Skeleton width="100%" height={38} className="sm:!w-24" />
          </div>
          <div className="flex gap-2 mb-5">
            <Skeleton width="50%" height={40} />
            <Skeleton width="50%" height={40} />
          </div>
          <div className="bg-white/5 rounded-3xl p-4 sm:p-8">
            <Skeleton width={160} height={22} className="mb-5" />
            <Skeleton height={48} className="mb-4" />
            <Skeleton height={48} className="mb-4" />
            <Skeleton height={48} />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "orders") {
    return (
      <div className="max-w-6xl mx-auto px-4 pt-10 sm:pt-16 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton circle width={28} height={28} />
          <Skeleton width={180} height={30} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <Skeleton width={70} height={13} />
                  <Skeleton width={110} height={18} className="mt-2" />
                </div>
                <Skeleton width={80} height={32} borderRadius={20} />
              </div>
              <Skeleton width={90} height={13} />
              <Skeleton width={110} height={26} className="mt-2 mb-4" />
              <Skeleton width={110} height={13} />
              <Skeleton count={2} height={16} className="mt-2" />
              <Skeleton width={130} height={16} className="mt-2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;

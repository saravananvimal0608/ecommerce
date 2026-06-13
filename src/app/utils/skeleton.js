import Skeleton from "react-loading-skeleton";

 const SkeletonLoader = ({ variant }) => {
  if (variant === "banner") {
    return (
      <div className="h-screen w-full">
        <Skeleton height="100%" />
      </div>
    );
  }

  if (variant === "product") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="border rounded-lg p-3">
            <Skeleton height={240} />

            <Skeleton height={20} className="mt-3" />

            <Skeleton height={15} width="80%" />

            <Skeleton height={25} width="40%" className="mt-2" />

            <Skeleton height={40} className="mt-3" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "thumbs") {
    return (
      <div>
        <Skeleton height={320} />

        <div className="grid grid-cols-4 gap-2 mt-3">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={index} height={80} />
          ))}
        </div>
      </div>
    );
  }

  if (variant === "category") {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-white rounded-2xl p-6 shadow-xl"
        >
          <Skeleton circle width={100} height={100} />

          <Skeleton
            height={20}
            width={100}
            className="mt-4"
          />
        </div>
      ))}
    </div>
  );
}


if (variant === "productPage") {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-md p-3"
        >
          <Skeleton height={224} />

          <Skeleton
            height={20}
            className="mt-3"
          />

          <Skeleton
            height={15}
            width="70%"
          />

          <Skeleton
            count={2}
            className="mt-2"
          />

          <div className="flex justify-between mt-3">
            <Skeleton
              width={80}
              height={25}
            />
            <Skeleton
              width={60}
              height={30}
            />
          </div>
        </div>
      ))}
    </div>
  );
}


if (variant === "singleProduct") {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-15 pb-12">
      <div className="grid grid-cols-12 gap-8">
        
        {/* Thumbnails */}
        <div className="col-span-1 flex flex-col gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={64} width={64} />
          ))}
        </div>

        {/* Main Image */}
        <div className="col-span-5">
          <Skeleton height={500} />
        </div>

        {/* Product Details */}
        <div className="col-span-6 space-y-4">
          <Skeleton height={20} width={120} />

          <Skeleton height={40} width="80%" />

          <Skeleton height={20} width={150} />

          <Skeleton height={40} width={120} />

          <Skeleton count={3} />

          <Skeleton height={20} width="60%" />
          <Skeleton height={20} width="50%" />
          <Skeleton height={20} width="40%" />

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

      {/* Related Products */}
      <div className="mt-16">
        <Skeleton height={30} width={200} />
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} height={300} />
          ))}
        </div>
      </div>
    </div>
  );
}

if (variant === "cart") {
  return (
    <div className="max-w-7xl mx-auto pt-24 pb-12 px-6">
      <Skeleton height={35} width={250} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border p-4 flex gap-4"
            >
              <Skeleton width={112} height={112} />

              <div className="flex-1">
                <Skeleton height={20} width="70%" />
                <Skeleton
                  count={2}
                  className="mt-2"
                />

                <div className="flex justify-between mt-4">
                  <Skeleton
                    width={80}
                    height={25}
                  />

                  <Skeleton
                    width={100}
                    height={35}
                  />
                </div>

                <div className="flex justify-end mt-3">
                  <Skeleton
                    width={120}
                    height={20}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-2xl border p-6">
            <Skeleton
              height={30}
              width={180}
            />

            <div className="mt-5 space-y-3">
              <Skeleton height={20} />
              <Skeleton height={20} />
              <Skeleton height={20} />
            </div>

            <Skeleton
              height={45}
              className="mt-6"
            />

            <Skeleton
              height={20}
              width="60%"
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


if (variant === "checkout") {
  return (
    <div className="max-w-7xl mx-auto pt-24 pb-12 px-6">
      <Skeleton height={35} width={200} className="mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side */}
        <div className="lg:col-span-2 space-y-6">

          {/* Address */}
          <div className="bg-white rounded-2xl p-6">
            <Skeleton height={25} width={180} className="mb-4" />

            {[1, 2].map((_, i) => (
              <div
                key={i}
                className="border rounded-xl p-4 mb-3"
              >
                <Skeleton height={18} width="60%" />
                <Skeleton height={14} width="40%" className="mt-2" />
                <Skeleton height={14} width="30%" className="mt-2" />
              </div>
            ))}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl p-6">
            <Skeleton height={25} width={180} className="mb-4" />

            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 mb-4"
              >
                <Skeleton height={64} width={64} />

                <div className="flex-1">
                  <Skeleton height={18} width="70%" />
                  <Skeleton height={14} width="50%" className="mt-2" />
                </div>

                <Skeleton height={18} width={70} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Side */}
        <div>
          <div className="bg-white rounded-2xl p-6">
            <Skeleton height={25} width={150} className="mb-5" />

            {[1, 2, 3].map((_, i) => (
              <div
                key={i}
                className="flex justify-between mb-3"
              >
                <Skeleton height={15} width={120} />
                <Skeleton height={15} width={50} />
              </div>
            ))}

            <Skeleton height={1} className="my-4" />

            <div className="flex justify-between mb-4">
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={80} />
            </div>

            <Skeleton height={50} borderRadius={9999} />
          </div>
        </div>

      </div>
    </div>
  );
}


if (variant === "userProfile") {
  return (
    <div className="min-h-screen common-bg px-4 py-24">
      <div className="max-w-3xl mx-auto">

        {/* Avatar Card */}
        <div className="bg-white/5 rounded-3xl p-6 mb-6 flex items-center gap-6">
          <Skeleton circle width={80} height={80} />

          <div className="flex-1">
            <Skeleton width={180} height={25} />
            <Skeleton width={250} height={18} className="mt-2" />
            <Skeleton width={90} height={20} className="mt-2" />
          </div>

          <Skeleton width={100} height={40} />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <Skeleton width={130} height={40} />
          <Skeleton width={150} height={40} />
        </div>

        {/* Form Card */}
        <div className="bg-white/5 rounded-3xl p-8">
          <Skeleton width={180} height={25} className="mb-6" />

          <Skeleton height={50} className="mb-4" />
          <Skeleton height={50} className="mb-4" />

          <Skeleton height={48} />
        </div>
      </div>
    </div>
  );
}

if (variant === "orders") {
  return (
    <div className="max-w-6xl mx-auto px-4 pt-15 pb-10">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-8">
        <Skeleton circle width={30} height={30} />
        <Skeleton width={200} height={35} />
      </div>

      {/* Order Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <Skeleton width={80} height={15} />
                <Skeleton width={120} height={20} className="mt-2" />
              </div>

              <Skeleton
                width={90}
                height={35}
                borderRadius={20}
              />
            </div>

            {/* Amount */}
            <Skeleton width={100} height={15} />
            <Skeleton
              width={120}
              height={30}
              className="mt-2 mb-5"
            />

            {/* Address */}
            <Skeleton width={120} height={15} />
            <Skeleton
              count={2}
              height={18}
              className="mt-2"
            />

            <Skeleton
              width={140}
              height={18}
              className="mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

  return null;
};


export default SkeletonLoader
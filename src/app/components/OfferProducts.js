import Image from "next/image";
import Link from "next/link";

async function getOfferProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/product/allOfferProduct`,
    {
      next: {
        revalidate: 86400,
      },
    },
  );

  return res.json();
}

export default async function OfferProducts() {
  const result = await getOfferProducts();

  return (
  <section className="px-4 md:px-8">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative md:-top-[35px] z-10">
    {result.data?.map((product) => (
      <div
        key={product._id}
        className="rounded-3xl common-bg flex flex-col sm:flex-row items-center p-4 gap-4 hover:scale-[1.02] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        {/* Content */}
        <div className="flex-1 text-white text-center sm:text-left">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            {product.name}
          </h3>

          <p className="text-gray-200 mb-4 line-clamp-3 text-sm md:text-base">
            {product.description}
          </p>

          <div className="flex justify-center sm:justify-start items-center gap-3 mb-4">
            <span className="text-2xl md:text-3xl font-bold">
              ₹{product.price}
            </span>
          </div>

          <Link
            href={`/product/${product._id}`}
            className="inline-block bg-white text-black px-5 py-2.5 rounded-xl font-semibold hover:bg-gray-200 transition"
          >
            Buy Now →
          </Link>
        </div>

        {/* Image */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 flex-shrink-0">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover rounded-2xl"
          />
        </div>
      </div>
    ))}
  </div>
</section>
  );
}

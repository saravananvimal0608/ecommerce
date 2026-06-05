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
    <section className="">
        <div className="flex flex-wrap justify-center gap-5 relative -top-[35px] z-10">
          {result.data?.map((product) => (
            <div
              key={product._id}
              className="rounded-3xl common-bg flex flex-col md:flex-row items-center p-3 gap-3 hover:scale-[1.02] transition-all duration-300 shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
            >
              {/* Content */}
              <div className=" text-white">
                <h3 className="text-2xl font-bold mb-3">{product.name}</h3>

                <p className="text-gray-200 mb-4 line-clamp-3">
                  {product.description}
                </p>

                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold">₹{product.price}</span>
                </div>

                <Link
                  href="/product"
                  className="inline-block bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
                >
                  Buy Now →
                </Link>
              </div>

              {/* Image */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover rounded-2xl"
                />
              </div>
            </div>
          ))}
        </div>
    </section>
  );
}

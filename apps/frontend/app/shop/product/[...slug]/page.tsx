import { Metadata } from "next";
import { BACKEND_URL } from "@/lib/constants";
import ProductClientPage, { Product } from "./client-page";
import ProductNav from "../../../../components/shop/product/ProductNav";
import {
  ProductImageGallery,
  ProductInfo,
  SellerInfo,
  ProductTabs,
} from "@/components/shop/product";
import { ProductNotFound } from "@/components/shop/product/NotFound";
import { authFetch } from "@/lib/authFetch";

type Props = {
  params: Promise<{ slug: string | string[] }>;
};

async function getProduct(
  slugRaw: string | string[] | undefined,
): Promise<Product | null> {
  if (!slugRaw) {
    console.log('slug raw is false: ', slugRaw)
    return null;
  }
  const slug = Array.isArray(slugRaw) ? slugRaw.join("/") : slugRaw;
  console.log('slug: ', slug)
  try {
    const res = await fetch(`${BACKEND_URL}/product/${slug}`, {
      // we can add next: { revalidate: 60 } or similar if we wanted
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.error && data[0]) {
      return data[0];
    }
  } catch (error) {
    console.error("Error fetching product metadata:", error);
  }
  console.log('returning null by the end')
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.slug);

  if (!product) {
    return {
      title: "Product Not Found | EcoStudent",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.title} | EcoStudent`,
    description: product.description,
    openGraph: {
      title: `${product.title} | EcoStudent`,
      description: product.description,
      images: [
        {
          url: product.images && product.images[0],
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ProductServerPage({ params }: Props) {
  const resolvedParams = await params;
  const slugRaw = resolvedParams.slug;
  const slugStr = Array.isArray(slugRaw) ? slugRaw.join("/") : slugRaw || "";
  const product = await getProduct(slugRaw);
  console.log('product : ', product)
  if (!product) return <ProductNotFound />;
  console.log("resolved params: ", resolvedParams);

  function handleShare(): void {
    console.log("Share clicked");
  }

  function handleReport(): void {
    console.log("Report clicked");
  }

  const fetchReviews = async () => {
    try {
      const res = await authFetch(`${BACKEND_URL}/review/${product.seller.id}`);
      if (!res.ok) throw new Error('reviews not found') ;

      const data = await res.json();
      return data;
    } catch (e) {
      console.log("Error fetching reviews", e);
      return []
    }
  };

  const reviews = await fetchReviews();

  return (
    <div>
      <ProductNav />
      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        <ProductImageGallery
          images={product.images}
          title={product.title}
          productId={product.id}
        />

        <div className="space-y-6">
          <ProductInfo
            title={product.title}
            description={product.description}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.seller.rating}
            reviewCount={product.seller.reviewCount}
            condition={product.condition}
            exchangeType={product.exchangeType}
            postedDate={product.postedDate}
            views={product.views}
            onShare={handleShare}
            onReport={handleReport}
          />

          <SellerInfo
            productId={product.id}
            seller={product.seller}
            distance={product.distance}
          />
        </div>
      </div>

      <ProductTabs
        description={product.description}
        specifications={product.specifications}
        reviews={reviews}
        location={product.location}
        distance={product.distance}
      />

      <ProductClientPage slug={slugStr} initialProduct={product} />;
    </div>
  );
}

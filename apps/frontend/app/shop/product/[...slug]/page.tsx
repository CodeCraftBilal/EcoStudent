import { Metadata } from "next";
import { BACKEND_URL } from "@/lib/constants";
import ProductClientPage, { Product } from "./client-page";

type Props = {
  params: Promise<{ slug: string | string[] }>;
};

async function getProduct(slugRaw: string | string[] | undefined): Promise<Product | null> {
  if (!slugRaw) return null;
  const slug = Array.isArray(slugRaw) ? slugRaw.join("/") : slugRaw;
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
  return null;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
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
        }
      ],
    },
  };
}

export default async function ProductServerPage({ params }: Props) {
  const resolvedParams = await params;
  const slugRaw = resolvedParams.slug;
  const slugStr = Array.isArray(slugRaw) ? slugRaw.join("/") : (slugRaw || "");
  const product = await getProduct(slugRaw);

  return <ProductClientPage slug={slugStr} initialProduct={product} />;
}


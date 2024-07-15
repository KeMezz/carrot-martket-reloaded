import ProductListSkeleton from "@/components/product-list-skeleton";

export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <ProductListSkeleton key={index} />
      ))}
    </div>
  );
}

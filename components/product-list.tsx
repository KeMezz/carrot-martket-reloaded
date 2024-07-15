"use client";

import { InitialProducts } from "@/app/(tabs)/home/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/home/actions";
import ProductListSkeleton from "./product-list-skeleton";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          const newProducts = await getMoreProducts(page);
          if (newProducts.length === 0) {
            setIsLastPage(true);
          } else {
            setPage((prev) => prev + 1);
            setProducts([...products, ...newProducts]);
          }
        }
      },
      { threshold: 1.0, rootMargin: "0px 0px -100px 0px" }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page, products]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      {isLastPage ? (
        <div className="flex justify-center w-full text-neutral-600 mt-4">
          마지막 항목입니다
        </div>
      ) : (
        <div ref={trigger} className="flex flex-col gap-5">
          <ProductListSkeleton />
        </div>
      )}
    </div>
  );
}

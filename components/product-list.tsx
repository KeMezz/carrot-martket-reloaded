"use client";

import { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-product";
import { useEffect, useRef, useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLastPage, setIsLastPage] = useState(false);

  const trigger = useRef<HTMLSpanElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page);
          if (newProducts.length === 0) {
            setIsLastPage(true);
          } else {
            setPage((prev) => prev + 1);
            setProducts([...products, ...newProducts]);
          }
          setIsLoading(false);
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
      {isLastPage ? null : (
        <span
          ref={trigger}
          style={{
            marginTop: `${page + 1 * 900}vh`,
          }}
          className="mb-96 text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-0- active:scale-95 transition-transform disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? "로딩 중..." : "더 보기"}
        </span>
      )}
    </div>
  );
}

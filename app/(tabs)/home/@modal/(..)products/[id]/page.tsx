"use server";

import ModalCloseButton from "@/components/modal-close-button";
import ProductSkeleton from "@/components/product-skeleton";
import db from "@/lib/db";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

export default async function ProductModal({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(+params.id);
  return (
    <div>
      <div className="absolute w-full h-full top-0 left-0 flex justify-center items-center z-10 bg-black bg-opacity-50 px-5">
        <ModalCloseButton />
        <div className="max-w-screen-sm w-full dark:bg-neutral-900 rounded-2xl overflow-x-scroll max-h-[calc(70vh)]">
          {product ? (
            <div className="w-full">
              <div className="relative aspect-square">
                <Image
                  fill
                  className="object-cover"
                  src={product.photo}
                  alt={product.title}
                />
              </div>
              <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
                <div className="size-10 overflow-hidden rounded-full">
                  {product.user.avatar !== null ? (
                    <Image
                      src={product.user.avatar}
                      width={40}
                      height={40}
                      alt={product.user.username}
                    />
                  ) : (
                    <UserIcon />
                  )}
                </div>
                <div>
                  <h3>{product.user.username}</h3>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex flex-col gap-2 w-4/6">
                  <h1 className="text-2xl font-semibold">{product.title}</h1>
                  <p>{product.description}</p>
                </div>
                <span className="font-semibold text-xl w-2/6 text-right">
                  {formatToWon(product.price)}원
                </span>
              </div>
            </div>
          ) : (
            <ProductSkeleton />
          )}
        </div>
      </div>
      {/* <div className="absolute top-0 left-0 bg-black w-full h-full opacity-30 z-0" /> */}
    </div>
  );
}

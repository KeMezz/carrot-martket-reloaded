"use server";

import db from "@/lib/db";

export async function getMoreProducts(skip: number) {
  const pageSize = 10;
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    take: pageSize,
    skip: skip * pageSize + 1,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

"use server";

import db from "@/lib/db";

export async function getMoreProducts(skip: number) {
  const pageSize = 1;
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    take: pageSize,
    skip: skip * pageSize,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

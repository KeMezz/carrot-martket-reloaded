"use server";

import db from "@/lib/db";

export async function getMoreProducts(page: number) {
  const products = await db.product.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
    take: 1,
    skip: page,
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

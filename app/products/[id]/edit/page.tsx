import { notFound } from "next/navigation";
import db from "@/lib/db";
import getSession from "@/lib/session";
import EditProductForm from "@/components/edit-product-form";

interface ProductEditProps {
  params: {
    id: string;
  };
}

const getProduct = async (id: number) => {
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
};

const getIsOwner = async (userId: number) => {
  const session = await getSession();
  if (session) {
    return session.id === userId;
  }
  return false;
};

export default async function ProductEdit({ params }: ProductEditProps) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);
  if (!isOwner) {
    return notFound();
  }

  return (
    <div>
      <EditProductForm product={product} />
    </div>
  );
}

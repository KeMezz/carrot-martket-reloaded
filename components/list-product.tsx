import Image from "next/image";
import Link from "next/link";

interface ListProductProps {
  id: number;
  title: string;
  price: number;
  created_at: Date;
  photo: string;
}

export default function ListProduct({
  id,
  title,
  price,
  created_at,
  photo,
}: ListProductProps) {
  return (
    <Link href={`/products/${id}`} className="flex gap-5">
      <div className="size-28 bg-neutral-700 relative rounded-md overflow-hidden">
        <Image fill src={photo} alt={title} />
      </div>
      <div className="flex flex-col gap-2 *:text-white justify-center">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {created_at.toLocaleDateString()}
        </span>
        <span className="text-lg font-semibold">${price}</span>
      </div>
    </Link>
  );
}

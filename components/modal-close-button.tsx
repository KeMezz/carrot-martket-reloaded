"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import { useRouter } from "next/navigation";

export default function ModalCloseButton() {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <button onClick={goBack} className="absolute right-5 top-5">
      <XMarkIcon className="size-10" />
    </button>
  );
}

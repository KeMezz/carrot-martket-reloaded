"use client";

import { ButtonHTMLAttributes } from "react";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
  loadingMessage?: string;
}

export default function Button({
  text,
  loadingMessage = "불러오는 중...",
  ...attrs
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button className="primary-btn" disabled={pending} {...attrs}>
      {pending ? loadingMessage : text}
    </button>
  );
}

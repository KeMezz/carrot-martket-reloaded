"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
  loadingMessage?: string;
}

export default function FormButton({
  text,
  loadingMessage = "불러오는 중...",
}: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button className="primary-btn" disabled={pending}>
      {pending ? loadingMessage : text}
    </button>
  );
}

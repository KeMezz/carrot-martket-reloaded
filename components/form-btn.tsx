"use client";

import { useFormStatus } from "react-dom";

interface FormButtonProps {
  text: string;
  loading: boolean;
  loadingMessage?: string;
}

export default function FormButton({
  text,
  loading,
  loadingMessage = "불러오는 중...",
}: FormButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button className="primary-btn" disabled={pending}>
      {pending ? loadingMessage : text}
    </button>
  );
}

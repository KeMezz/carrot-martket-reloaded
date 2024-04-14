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
  return (
    <button className="primary-btn" disabled={loading}>
      {loading ? loadingMessage : text}
    </button>
  );
}

import Link from "next/link";
import "@/lib/db";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen p-5">
      <div className="my-auto flex flex-col items-center gap-3">
        <span className="text-9xl mb-4 animate-bounce">🥕</span>
        <h1 className="text-4xl font-black">당근</h1>
        <h2 className="text-2xl font-medium">만나서 반가워요! 👏</h2>
      </div>
      <div className="flex flex-col items-center gap-4 w-full">
        <Link href="/create-account" className="primary-btn">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있나요?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}

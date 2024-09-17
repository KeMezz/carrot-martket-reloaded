export default function PostListSkeleton() {
  return (
    <div className="flex gap-5 *:animate-pulse">
      <div className="flex flex-col gap-2 *:rounded-md justify-center">
        <div className="bg-neutral-700 h-5 w-32" />
        <div className="bg-neutral-700 h-5 w-60" />
        <div className="flex gap-2 *:rounded-md">
          <div className="bg-neutral-700 h-5 w-10" />
          <div className="bg-neutral-700 h-5 w-10" />
        </div>
      </div>
    </div>
  );
}

export default function ProductListSkeleton() {
  return (
    <div className="flex gap-5 *:animate-pulse">
      <div className="size-28 bg-neutral-700 rounded-md" />
      <div className="flex flex-col gap-2 *:rounded-md justify-center">
        <div className="bg-neutral-700 h-5 w-40" />
        <div className="bg-neutral-700 h-5 w-20" />
        <div className="bg-neutral-700 h-5 w-10" />
      </div>
    </div>
  );
}

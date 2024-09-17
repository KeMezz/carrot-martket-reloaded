import PostListSkeleton from "@/components/post-list-skeleton";

export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <PostListSkeleton key={index} />
      ))}
    </div>
  );
}

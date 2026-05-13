import { SkeletonCard } from "@/components/shared/skeleton";

export default function JobDetailLoading() {
  return (
    <div className="space-y-5">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

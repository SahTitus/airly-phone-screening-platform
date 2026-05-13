import Image from "next/image";

import { cn } from "@/utils/cn";

type BrandMarkProps = {
  className?: string;
  centered?: boolean;
};

export function BrandMark({ className, centered }: BrandMarkProps) {
  return (
    <div className={cn("flex items-center", centered && "justify-center", className)}>
      <Image
        src="/aihrly-logo.png"
        alt="Aihrly by Remotown"
        width={150}
        height={50}
        priority
        className="h-auto w-29.5 object-contain sm:w-33"
      />
    </div>
  );
}

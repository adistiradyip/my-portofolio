import { getBrandLabel } from "@/lib/portfolio-utils";

export function BrandLogo({
  name,
  className = "",
  restClassName = "",
}: {
  name: string;
  className?: string;
  restClassName?: string;
}) {
  const logoWord = getBrandLabel(name).split(" ")[0] || getBrandLabel(name);

  return (
    <span className={className}>
      <span className="text-red-600">{logoWord.charAt(0)}</span>
      <span className={restClassName}>{logoWord.slice(1)}</span>
    </span>
  );
}

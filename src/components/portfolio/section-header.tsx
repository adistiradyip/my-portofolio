export function SectionHeader({
  badge,
  title,
  description,
  align = "center",
}: {
  badge?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-10 md:mb-14 ${align === "center" ? "text-center" : "text-left"}`}>
      {badge && (
        <span className="mb-4 inline-block text-sm font-bold uppercase tracking-[0.2em] text-[#ff5722]">
          {badge}
        </span>
      )}
      <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-extrabold leading-tight text-pf-text">
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 max-w-2xl text-[15px] leading-7 text-pf-muted ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

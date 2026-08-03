interface SectionTitleProps {
  title: string;
  subtitle: string;
}

function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div className="text-center mb-16">
      <h2 className="text-4xl md:text-5xl font-bold text-white">
        {title}
      </h2>

      <p className="mt-5 text-slate-400 max-w-2xl mx-auto">
        {subtitle}
      </p>
    </div>
  );
}

export default SectionTitle;
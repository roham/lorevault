import { type GuideSection as GuideSectionType } from '@/data/guide-content';

interface GuideSectionProps {
  section: GuideSectionType;
  children: React.ReactNode;
}

export default function GuideSection({ section, children }: GuideSectionProps) {
  return (
    <section id={section.id} className="scroll-mt-[104px] pb-12">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${section.accent}15` }}
        >
          {section.icon}
        </div>
        <div>
          <h2
            className="text-xl font-bold bg-clip-text text-transparent"
            style={{
              backgroundImage: `linear-gradient(135deg, ${section.accent}, ${section.accent}90)`,
            }}
          >
            {section.title}
          </h2>
          <p className="text-xs text-muted mt-0.5">{section.subtitle}</p>
        </div>
      </div>
      {/* Accent rule */}
      <div
        className="h-[2px] rounded-full mb-6"
        style={{
          background: `linear-gradient(to right, ${section.accent}40, transparent)`,
        }}
      />
      {/* Content */}
      <div className="space-y-6">{children}</div>
    </section>
  );
}

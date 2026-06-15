import React from "react";
import { FileText, Plane, DollarSign, Award, Star, Sparkles, Mail, MapPin } from "lucide-react";

export type FeatureCard = { id: string; title: string; description: string; icon_name: string; color: string; order_num: number };

const ICON_MAP: Record<string, any> = { FileText, Plane, DollarSign, Award, Star, Sparkles, Mail, MapPin };
const getIcon = (name: string) => ICON_MAP[name] || FileText;

const BORDER_COLOR: Record<string, string> = {
  rose: "border-rose-100",
  orange: "border-orange-100",
  teal: "border-teal-100",
  indigo: "border-indigo-100",
  slate: "border-slate-100",
};

const ICON_COLOR: Record<string, string> = {
  rose: "bg-rose-100 text-rose-600",
  orange: "bg-orange-100 text-orange-600",
  teal: "bg-teal-100 text-teal-600",
  indigo: "bg-indigo-100 text-indigo-600",
  slate: "bg-slate-100 text-slate-600",
};

interface OurServicesProps {
  title: string;
  subtitle: string;
  featureCards: FeatureCard[];
  onNavigateToEPassport?: () => void;
  onNavigateToVisa?: () => void;
}

export default function OurServices({
  title,
  subtitle,
  featureCards,
  onNavigateToEPassport,
  onNavigateToVisa,
}: OurServicesProps) {
  return (
    <section id="service" className="py-16 xl:py-24 bg-slate-50 border-t border-b border-slate-200 px-4 md:px-12">
      <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[85vw] mx-auto">
        <div className="text-center mb-12 xl:mb-16">
          <h2 className="text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl font-black text-slate-900 font-display tracking-tight uppercase">
            {title}
          </h2>
          <p className="text-xs xl:text-sm 2xl:text-base text-slate-500 font-mono mt-1">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8 2xl:gap-10">
          {featureCards.map((card, idx) => {
            const Icon = getIcon(card.icon_name);
            const isEpassport = idx === 0;
            const isVisa = idx === 1;
            return (
              <div
                key={card.id}
                onClick={
                  isEpassport
                    ? onNavigateToEPassport
                    : isVisa
                    ? onNavigateToVisa
                    : undefined
                }
                className={`group bg-white p-6 rounded-2xl border-2 border-slate-100 transition-all shadow-xs flex flex-col justify-between ${
                  BORDER_COLOR[card.color] || BORDER_COLOR.rose
                } ${isEpassport || isVisa ? "cursor-pointer" : ""}`}
              >
                <div className="space-y-4">
                  <div
                    className={`w-10 h-10 xl:w-12 xl:h-12 rounded-xl flex items-center justify-center ${
                      ICON_COLOR[card.color] || ICON_COLOR.rose
                    }`}
                  >
                    <Icon className="h-5 w-5 xl:h-6 xl:w-6" />
                  </div>
                  <h3 className="font-bold font-display text-base xl:text-lg 2xl:text-xl text-slate-950 leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs xl:text-sm 2xl:text-base leading-relaxed text-slate-500">
                    {card.description}
                  </p>
                </div>
                {(isEpassport || isVisa) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs xl:text-sm font-bold text-slate-800 group-hover:text-rose-600 transition-colors">
                    <span>Apply Now</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

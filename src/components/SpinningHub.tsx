import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, animate } from "motion/react";
import { Compass, Clock, Check } from "lucide-react";

const wheelSegments = [
  { id: 0, label: ["Invisible", "to AI"], color: "#1E1B6E" },
  { id: 1, label: ["#1 answer", "in AI search"], color: "#22C55E" },
  { id: 2, label: ["Brand not", "mentioned"], color: "#12115A" },
  { id: 3, label: ["Competitors", "rank first"], color: "#2B2880" },
  { id: 4, label: ["Not in", "top results"], color: "#3B39A0" },
];

const SEGMENTS = wheelSegments.length;
const DEG_PER_SEGMENT = 360 / SEGMENTS;

function SpinWheel({ onSpinDone }: { onSpinDone: (idx: number) => void }) {
  const rotation = useMotionValue(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Every frame: counter-rotate each text element so it stays upright
  useMotionValueEvent(rotation, "change", (value) => {
    if (!svgRef.current) return;
    svgRef.current.querySelectorAll<SVGTextElement>("[data-cx]").forEach((el) => {
      const cx = el.getAttribute("data-cx")!;
      const cy = el.getAttribute("data-cy")!;
      el.setAttribute("transform", `rotate(${-value}, ${cx}, ${cy})`);
    });
  });

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    const randomIdx = Math.floor(Math.random() * SEGMENTS);
    const targetAngle = 360 - (randomIdx * DEG_PER_SEGMENT) - (DEG_PER_SEGMENT / 2);
    const cur = rotation.get();
    const newAngle = cur + 360 * 6 + targetAngle - (cur % 360);

    animate(rotation, newAngle, {
      duration: 3.5,
      ease: "easeOut",
      onComplete: () => {
        setIsSpinning(false);
        onSpinDone(randomIdx);
      },
    });
  };

  return (
    <div
      className="relative w-[260px] h-[260px] flex items-center justify-center cursor-pointer select-none"
      onClick={spin}
    >
      {/* White pointer */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
        <div className="w-0 h-0 border-l-[11px] border-r-[11px] border-t-[20px] border-l-transparent border-r-transparent border-t-white drop-shadow-lg" />
      </div>

      {/* Dark outer ring */}
      <div className="w-full h-full rounded-full bg-[#0D0D3A] p-[6px] relative shadow-2xl">
        {/* Rotating wheel using motion value */}
        <motion.div
          style={{ rotate: rotation, transformOrigin: "center center" }}
          className="w-full h-full rounded-full overflow-hidden"
        >
          <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full">
            {wheelSegments.map((seg, idx) => {
              const a = idx * DEG_PER_SEGMENT;
              const radStart = (a - 90) * (Math.PI / 180);
              const radEnd = (a + DEG_PER_SEGMENT - 90) * (Math.PI / 180);
              const x1 = 50 + 50 * Math.cos(radStart);
              const y1 = 50 + 50 * Math.sin(radStart);
              const x2 = 50 + 50 * Math.cos(radEnd);
              const y2 = 50 + 50 * Math.sin(radEnd);

              const midAngle = a + DEG_PER_SEGMENT / 2 - 90;
              const radMid = midAngle * (Math.PI / 180);
              const tx = 50 + 32 * Math.cos(radMid);
              const ty = 50 + 32 * Math.sin(radMid);

              return (
                <g key={idx}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={seg.color}
                    stroke="none"
                  />
                  {/* data-cx/cy used by useMotionValueEvent to counter-rotate */}
                  {(seg.label as string[]).map((line, li) => (
                    <text
                      key={li}
                      x={tx}
                      y={ty + li * 5.5 - 2.5}
                      fill="rgba(255,255,255,0.92)"
                      fontSize="4.8"
                      fontWeight="bold"
                      textAnchor="middle"
                      data-cx={tx}
                      data-cy={ty}
                      className="pointer-events-none"
                      fontFamily="sans-serif"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#0D0D3A] rounded-full border-2 border-[#22C55E] flex items-center justify-center z-10 pointer-events-none shadow-lg">
          <div className="w-3 h-3 rounded-full bg-[#22C55E] opacity-90" />
        </div>
      </div>

      {/* Click hint */}
      {!isSpinning && (
        <div className="absolute bottom-[-28px] text-xs text-slate-400 font-semibold tracking-widest uppercase">
          Click to spin
        </div>
      )}
    </div>
  );
}


const serviceItems = [
  "Strict Engagement Filters",
  "Negotiation Scripts Pack",
  "Tracking Link System",
  "Deliverables Matrix Setup",
];

function ServiceCard({ segIdx }: { segIdx: number | null }) {
  return (
    <AnimatePresence>
      {segIdx !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-[300px] text-left mt-10 space-y-3"
        >
          {/* Header row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.4, ease: "easeOut" }}
            className="flex gap-3 items-center"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#EA580C] flex flex-shrink-0 items-center justify-center border border-[#FFEDD5]">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[14px] font-extrabold text-[#0F172A] leading-tight font-sans">
                Micro-Influencer Map Matrix
              </h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-[#F97316] font-bold text-[12px]">$300 - $500</span>
                <span className="text-slate-300">•</span>
                <span className="text-[#64748B] flex items-center gap-1 uppercase tracking-widest text-[8px] font-bold">
                  <Clock className="w-3 h-3" /> 4 BUSINESS DAYS
                </span>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
            className="text-[10px] italic text-[#64748B] leading-relaxed"
          >
            Sourcing and mapping 20 perfectly matching micro-influencers with active, targeted audiences.
          </motion.p>

          {/* Service items — one by one with 0.5s gap */}
          <div className="space-y-2">
            {serviceItems.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0 + i * 0.5, duration: 0.4, ease: "easeOut" }}
                className="flex items-start gap-2 text-[11px] text-[#475569] font-medium"
              >
                <Check className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Book Now button — appears last */}
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 + serviceItems.length * 0.5, duration: 0.4, ease: "easeOut" }}
            className="w-full py-3 bg-[#0F172A] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-700 transition-colors shadow-sm cursor-pointer mt-1"
          >
            BOOK NOW
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default function SpinningHub({ onRewardWon }: { onRewardWon?: (reward: string) => void }) {
  const [landed1, setLanded1] = useState<number | null>(null);
  const [landed2, setLanded2] = useState<number | null>(null);

  return (
    <div className="w-full flex items-start justify-center py-10 px-4 relative">
      {/* Centered Logo */}
      <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 z-30">
        <img src="/logo.png" alt="Logo" className="h-40 md:h-48 w-auto object-contain drop-shadow-md" />
      </div>

      <div className="flex flex-col md:flex-row gap-16 md:gap-40 lg:gap-56 items-center md:items-start justify-center mt-16 relative w-full max-w-7xl mx-auto">

        {/* Wheel 1 */}
        <div className="flex flex-col items-center">
          <SpinWheel onSpinDone={(idx) => {
            setLanded1(idx);
            onRewardWon?.(wheelSegments[idx].label.join(" "));
          }} />
          <ServiceCard segIdx={landed1} />
        </div>

        {/* Wheel 2 */}
        <div className="flex flex-col items-center">
          <SpinWheel onSpinDone={(idx) => {
            setLanded2(idx);
            onRewardWon?.(wheelSegments[idx].label.join(" "));
          }} />
          <ServiceCard segIdx={landed2} />
        </div>

      </div>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Clock, Check } from "lucide-react";

const wheelSegments = [
  { id: 0, label: "P1", color: "#EF4444" },
  { id: 1, label: "P2", color: "#F97316" },
  { id: 2, label: "P3", color: "#EAB308" },
  { id: 3, label: "P4", color: "#10B981" },
  { id: 4, label: "S4", color: "#06B6D4" },
  { id: 5, label: "S5", color: "#3B82F6" },
  { id: 6, label: "P7", color: "#6366F1" },
  { id: 7, label: "P8", color: "#8B5CF6" },
];

function SpinCard({ wheelId, title }: { wheelId: string, title: string }) {
  const [angle, setAngle] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [landed, setLanded] = useState("Slice #3");

  const spin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    
    // random slice
    const randomIdx = Math.floor(Math.random() * 8);
    const degreePerSegment = 360 / 8;
    const targetAngle = 360 - (randomIdx * degreePerSegment) - (degreePerSegment / 2);
    const newAngle = angle + (360 * 6) + targetAngle - (angle % 360);
    
    setAngle(newAngle);
    
    setTimeout(() => {
      setIsSpinning(false);
      setLanded(`Slice #${randomIdx + 1}`);
    }, 3500);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 w-full max-w-[380px] flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00A3FF]"></div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{wheelId}</span>
        </div>
      </div>
      
      <h3 className="text-[13px] font-extrabold text-slate-700 uppercase tracking-wider mb-6 text-center px-4">
        {title}
      </h3>

      {/* Wheel Area */}
      <div className="relative w-[240px] h-[240px] mb-6 flex items-center justify-center cursor-pointer" onClick={spin}>
        {/* Pointer */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center filter drop-shadow-md">
          <div className="w-0 h-0 border-l-[10px] border-r-[10px] border-t-[16px] border-l-transparent border-r-transparent border-t-[#E53E3E]"></div>
          <div className="w-3 h-3 bg-white rounded-full -mt-2 border-2 border-[#E53E3E]"></div>
        </div>

        {/* The Wheel */}
        <div className="w-full h-full rounded-full bg-[#1E293B] p-2.5 relative shadow-xl">
          {/* Outer Dots */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-1 h-1 bg-slate-300 rounded-full"
              style={{
                top: `calc(50% - 0.125rem + 110px * ${Math.sin((i * 22.5 - 90) * Math.PI / 180)})`,
                left: `calc(50% - 0.125rem + 110px * ${Math.cos((i * 22.5 - 90) * Math.PI / 180)})`,
              }}
            ></div>
          ))}

          {/* Inner Rotating SVG */}
          <motion.div
            style={{ transformOrigin: "center center" }}
            animate={{ rotate: angle }}
            transition={{ duration: 3.5, ease: "easeOut" }}
            className="w-full h-full rounded-full overflow-hidden relative"
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {wheelSegments.map((seg, idx) => {
                const a = idx * 45;
                const radStart = (a - 90) * (Math.PI / 180);
                const radEnd = (a + 45 - 90) * (Math.PI / 180);
                const x1 = 50 + 50 * Math.cos(radStart);
                const y1 = 50 + 50 * Math.sin(radStart);
                const x2 = 50 + 50 * Math.cos(radEnd);
                const y2 = 50 + 50 * Math.sin(radEnd);
                
                const labelAngle = a + 22.5 - 90;
                const radLabel = labelAngle * (Math.PI / 180);
                const tx = 50 + 32 * Math.cos(radLabel);
                const ty = 50 + 32 * Math.sin(radLabel);

                return (
                  <g key={idx}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                      fill={seg.color}
                      stroke="#1E293B"
                      strokeWidth="0.5"
                    />
                    <text
                      x={tx}
                      y={ty}
                      fill="#ffffff"
                      fontSize="5.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      transform={`rotate(${a + 22.5}, ${tx}, ${ty})`}
                      className="pointer-events-none"
                    >
                      {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </motion.div>
            
          {/* Center Circle (Fixed, outside motion) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-[#111827] rounded-full border-4 border-white flex flex-col items-center justify-center shadow-inner z-10 pointer-events-none">
            <span className="text-[7px] text-white font-black tracking-widest mt-1.5 leading-none">CLICK</span>
            <span className="text-[11px] text-[#FFD700] font-black tracking-widest mt-0.5 leading-none">SPIN</span>
          </div>
        </div>
      </div>

      {/* Landed Sector */}
      <div className="w-full border border-dashed border-slate-200 bg-[#F8FAFC] rounded-lg py-2.5 text-center text-[10px] text-[#64748B] mb-4">
        landed sector: <span className="font-bold text-[#1E293B]">{landed}</span>
      </div>

      {/* Service Card */}
      <div className="w-full border border-[#E2E8F0] rounded-xl p-4 bg-white text-left shadow-sm">
        <div className="text-[9px] font-extrabold text-[#94A3B8] tracking-widest uppercase mb-3">
          SERVICE
        </div>
        
        <div className="flex gap-3 mb-3.5">
          <div className="w-10 h-10 rounded-lg bg-[#FFF7ED] text-[#EA580C] flex flex-shrink-0 items-center justify-center border border-[#FFEDD5]">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-[14px] font-extrabold text-[#0F172A] leading-tight font-sans">Micro-Influencer Map Matrix</h4>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-[#F97316] font-bold text-[12px]">$ $300 - $500</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#64748B] flex items-center gap-1 uppercase tracking-widest text-[8px] font-bold">
                <Clock className="w-3 h-3" /> 4 BUSINESS DAYS
              </span>
            </div>
          </div>
        </div>

        <div className="border border-[#F1F5F9] rounded-md p-3 text-[10px] italic text-[#64748B] mb-4 bg-[#F8FAFC]/50 leading-relaxed">
          Sourcing and mapping 20 perfectly matching micro-influencers with active, targeted audiences.
        </div>

        <div className="space-y-2 mb-5 text-[11px] text-[#475569] font-medium">
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0" />
            <span>Strict Engagement Filters</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0" />
            <span>Negotiation Scripts Pack</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0" />
            <span>Tracking Link System</span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-[#F97316] flex-shrink-0" />
            <span>Deliverables Matrix Setup</span>
          </div>
        </div>

        <button className="w-full py-3 bg-[#0F172A] text-white rounded-lg font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-sm cursor-pointer">
          BOOK NOW
        </button>
      </div>
    </div>
  );
}

export default function SpinningHub({ onRewardWon }: { onRewardWon?: (reward: string) => void }) {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row gap-6 max-w-5xl mx-auto justify-center items-center md:items-start w-full">
        <SpinCard wheelId="WHEEL 1" title="GROWTH AMPLIFIERS & OPTIMIZATION" />
        <SpinCard wheelId="WHEEL 2" title="GROWTH AMPLIFIERS & OPTIMIZATION" />
      </div>
    </div>
  );
}


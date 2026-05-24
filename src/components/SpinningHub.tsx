import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useMotionValueEvent, animate } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

type WheelSegment = {
  id: number;
  label: string[];
  color: string;
};

// ডাটাবেজে কানেক্ট না হলে বা লোড হতে দেরি হলে এই ডিফল্ট লিস্ট কাজ করবে
const FALLBACK_SEGMENTS: WheelSegment[] = [
  { id: 0, label: ["10%", "Discount"], color: "#1E1B6E" },
  { id: 1, label: ["Free", "Consultation"], color: "#22C55E" }, // এই সবুজ ঘরটাই সবসময় জিতবে
  { id: 2, label: ["VIP", "Support"], color: "#12115A" },
  { id: 3, label: ["Priority", "Processing"], color: "#2B2880" },
  { id: 4, label: ["Free Name", "Clearance"], color: "#3B39A0" },
];

const wrapLabel = (labelLines: string[]): string[] => {
  const wrapped: string[] = [];
  labelLines.forEach(line => {
    if (line.length > 11 && line.includes(" ")) {
      const words = line.split(" ");
      const mid = Math.ceil(words.length / 2);
      wrapped.push(words.slice(0, mid).join(" "), words.slice(mid).join(" "));
    } else {
      wrapped.push(line);
    }
  });
  return wrapped;
};

type SpinWheelProps = {
  segments: WheelSegment[];
  onSpinDone: (idx: number) => void;
};

function SpinWheel({ segments, onSpinDone }: SpinWheelProps) {
  const rotation = useMotionValue(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const SEGMENTS_COUNT = segments.length || 5;
  const DEG_PER_SEGMENT = 360 / SEGMENTS_COUNT;

  // DOM QuerySelector-এর পারফরম্যান্স অপ্টিমাইজেশন
  useMotionValueEvent(rotation, "change", (value) => {
    if (!svgRef.current) return;
    const texts = svgRef.current.querySelectorAll<SVGTextElement>("[data-cx]");
    for (let i = 0; i < texts.length; i++) {
      const el = texts[i];
      const cx = el.getAttribute("data-cx")!;
      const cy = el.getAttribute("data-cy")!;
      el.setAttribute("transform", `rotate(${-value}, ${cx}, ${cy})`);
    }
  });

  const spin = () => {
    if (isSpinning || isBlinking || segments.length === 0) return;
    setIsSpinning(true);
    setIsBlinking(false);

    // উইনার সবসময় ১ নম্বর ইনডেক্স (সবুজ অংশ) ফিক্সড
    const targetIdx = 1; 
    const targetAngle = 360 - (targetIdx * DEG_PER_SEGMENT) - (DEG_PER_SEGMENT / 2);
    const cur = rotation.get();
    const newAngle = cur + 360 * 6 + targetAngle - (cur % 360);

    animate(rotation, newAngle, {
      duration: 3.5,
      ease: [0.25, 0.1, 0.25, 1], // মসৃণ স্টপের জন্য custom easing
      onComplete: () => {
        setIsSpinning(false);
        setIsBlinking(true);

        setTimeout(() => {
          setIsBlinking(false);
          onSpinDone(targetIdx);
        }, 1200);
      },
    });
  };

  return (
    <div
      className="relative w-[260px] h-[260px] flex items-center justify-center cursor-pointer select-none"
      onClick={spin}
    >
      {/* Blinking Pointer */}
      <motion.div 
        className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
        animate={isBlinking ? { opacity: [1, 0, 1, 0, 1, 0, 1] } : { opacity: 1 }}
        transition={{ duration: 1.2, ease: "linear" }}
      >
        <div className="w-0 h-0 border-l-[11px] border-r-[11px] border-t-[20px] border-l-transparent border-r-transparent border-t-[#F59E0B] drop-shadow-[0_4px_6px_rgba(245,158,11,0.4)]" />
      </motion.div>

      {/* Dark outer ring */}
      <div className="w-full h-full rounded-full bg-[#0D0D3A] p-[6px] relative shadow-2xl">
        <motion.div
          style={{ rotate: rotation }}
          className="w-full h-full rounded-full overflow-hidden origin-center"
        >
          <svg ref={svgRef} viewBox="0 0 100 100" className="w-full h-full">
            {segments.map((seg, idx) => {
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

              const lines = wrapLabel(seg.label);
              const N = lines.length;
              const gap = 4.8;

              return (
                <g key={seg.id || idx}>
                  <path
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={seg.color}
                    stroke="none"
                  />
                  {lines.map((line, li) => (
                    <text
                      key={li}
                      x={tx}
                      y={ty + (li - (N - 1) / 2) * gap}
                      fill="rgba(255,255,255,0.92)"
                      fontSize={line.length > 18 ? "2.8" : line.length > 14 ? "3.4" : line.length > 10 ? "3.9" : "4.5"}
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
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-[#0D0D3A] rounded-full border-2 border-[#22C55E] flex items-center justify-center z-10 pointer-events-none shadow-lg"
          animate={isBlinking ? { scale: [1, 1.1, 1, 1.1, 1], borderColor: ["#22C55E", "#F59E0B", "#22C55E"] } : { scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <div className="w-3 h-3 rounded-full bg-[#22C55E] opacity-90" />
        </motion.div>
      </div>

      {!isSpinning && !isBlinking && (
        <div className="absolute bottom-[-34px] bg-[#0D0D3A]/90 backdrop-blur-md border border-emerald-500/40 text-emerald-400 font-display font-black text-[10px] tracking-widest uppercase px-5 py-2 rounded-full shadow-lg shadow-emerald-500/20 animate-bounce flex items-center gap-1.5 z-20 pointer-events-none transition-all">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '3s' }} />
          <span>Click to spin</span>
        </div>
      )}
    </div>
  );
}

const fallbackTradingServices = [
  "Mother Company Setup", "Name Clearance", "Investment Licences (MISA)", "SBC Approved",
  "Commercial Registration (CR)", "Muqeem Portal Registration", "Qiwa Portal Registration", "Chamber of Commerce",
];

const fallbackServiceServices = [
  "VAT / Zakat Registration", "National Address (SPL)", "Business Bank Account", "Mudad Account Registration"
];

function ServiceCard({ segIdx, type }: { segIdx: number | null; type: "trading" | "service" }) {
  const [consultancyServices, setConsultancyServices] = useState<string[]>(type === "trading" ? fallbackTradingServices : fallbackServiceServices);

  useEffect(() => {
    let isMounted = true;
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('name')
          .eq('type', type)
          .order('order_num', { ascending: true });
        if (isMounted && data && data.length > 0) {
          setConsultancyServices(data.map(s => s.name));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchServices();
    return () => { isMounted = false; };
  }, [type]);

  return (
    <AnimatePresence>
      {segIdx !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full max-w-[320px] text-left mt-8 relative"
        >
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-5">
            <h4 className="text-[14px] font-black text-slate-900 uppercase tracking-widest font-display mb-1">Included Services</h4>
            <p className="text-[10px] text-slate-500 font-medium">Everything you need for full corporate compliance</p>
          </motion.div>

          <div className="space-y-3">
            {consultancyServices.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.35, duration: 0.5, ease: "easeOut" }}
                className="flex items-start gap-2.5"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.35 + 0.15, duration: 0.3, type: "spring", stiffness: 200 }}
                  className="mt-0.5 w-4 h-4 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </motion.div>
                <span className="text-[11px] text-slate-700 font-bold leading-tight">{item}</span>
              </motion.div>
            ))}
          </div>

          <motion.a
            href="https://wa.me/966501112222?text=Hello%21%20I%20am%20interested%20in%20your%20business%20consultancy%20and%20investor%20licensing%20services."
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + consultancyServices.length * 0.35 + 0.3, duration: 0.5 }}
            className="w-full block text-center mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors shadow-md no-underline"
          >
            BOOK NOW
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function SpinningHub({ onRewardWon }: { onRewardWon?: (reward: string) => void }) {
  const [segments1, setSegments1] = useState<WheelSegment[]>(FALLBACK_SEGMENTS);
  const [segments2, setSegments2] = useState<WheelSegment[]>(FALLBACK_SEGMENTS);
  const [landed1, setLanded1] = useState<number | null>(null);
  const [landed2, setLanded2] = useState<number | null>(null);

  useEffect(() => {
    const fetchWheelConfig = async () => {
      try {
        // ১. চাকার বেসিক কনফিগারেশন লোড করা
        const { data: wheelData, error: wheelError } = await supabase
          .from("wheel_config")
          .select("*")
          .order("order_num", { ascending: true });

        // If the table doesn't exist, we just ignore it and use fallback

        // ২. সাইট সেটিংস থেকে অ্যাডমিনের দেওয়া কাস্টম উইনার লেবেল লোড করা
        const { data: settingsData } = await supabase
          .from("site_settings")
          .select("*")
          .in("key", ["wheel1_winner_line1", "wheel1_winner_line2", "wheel2_winner_line1", "wheel2_winner_line2"]);

        // সেটিংস ডাটাকে সহজে পড়ার জন্য অবজেক্টে রূপান্তর
        const customWinner: Record<string, string> = {};
        settingsData?.forEach(item => {
          customWinner[item.key] = item.value;
        });

        if (wheelData && wheelData.length > 0) {
          const formattedSegments1 = wheelData.map((item: any, idx: number) => {
            // যদি ইনডেক্স ১ (সবুজ অংশ) হয় এবং অ্যাডমিন প্যানেল থেকে লেখা চেঞ্জ করা থাকে
            if (idx === 1 && (customWinner.wheel1_winner_line1 || customWinner.wheel1_winner_line2)) {
              return {
                id: item.id,
                label: [customWinner.wheel1_winner_line1, customWinner.wheel1_winner_line2].filter(Boolean),
                color: item.color
              };
            }
            return {
              id: item.id,
              label: [item.label_line1, item.label_line2].filter(Boolean),
              color: item.color
            };
          });
          
          const formattedSegments2 = wheelData.map((item: any, idx: number) => {
            // যদি ইনডেক্স ১ (সবুজ অংশ) হয় এবং অ্যাডমিন প্যানেল থেকে লেখা চেঞ্জ করা থাকে
            if (idx === 1 && (customWinner.wheel2_winner_line1 || customWinner.wheel2_winner_line2)) {
              return {
                id: item.id,
                label: [customWinner.wheel2_winner_line1, customWinner.wheel2_winner_line2].filter(Boolean),
                color: item.color
              };
            }
            return {
              id: item.id,
              label: [item.label_line1, item.label_line2].filter(Boolean),
              color: item.color
            };
          });
          
          setSegments1(formattedSegments1);
          setSegments2(formattedSegments2);
        } else {
          // যদি wheel_config টেবিল ফাকা থাকে কিন্তু অ্যাডমিন প্যানেলের সাইট টেক্সট থাকে, তবে ফলব্যাক লিস্ট আপডেট করা
          setSegments1(prev => prev.map((seg, idx) => idx === 1 && (customWinner.wheel1_winner_line1 || customWinner.wheel1_winner_line2) ? {
            ...seg,
            label: [customWinner.wheel1_winner_line1, customWinner.wheel1_winner_line2].filter(Boolean)
          } : seg));
          
          setSegments2(prev => prev.map((seg, idx) => idx === 1 && (customWinner.wheel2_winner_line1 || customWinner.wheel2_winner_line2) ? {
            ...seg,
            label: [customWinner.wheel2_winner_line1, customWinner.wheel2_winner_line2].filter(Boolean)
          } : seg));
        }
      } catch (err) {
        console.error("Error fetching wheel configuration:", err);
      }
    };

    fetchWheelConfig();
  }, []);

  return (
    <div className="w-full flex items-start justify-center py-10 px-4 relative">
      <div className="absolute -top-10 md:-top-12 left-1/2 -translate-x-1/2 z-30">
        <img src="/logo.png" alt="Logo" className="h-40 md:h-48 w-auto object-contain drop-shadow-md" />
      </div>

      <div className="flex flex-col md:flex-row gap-16 md:gap-40 lg:gap-56 items-center md:items-start justify-center mt-16 relative w-full max-w-7xl mx-auto">
        
        {/* Wheel 1 */}
        <div className="flex flex-col items-center">
          <SpinWheel 
            segments={segments1} 
            onSpinDone={(idx) => {
              setLanded1(idx);
              onRewardWon?.(segments1[idx].label.join(" "));
            }} 
          />
          <div className="mt-12 px-6 py-2 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border-2 border-orange-100 shadow-sm text-center hover:scale-105 transition-transform duration-300">
            <span className="text-[13px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-orange-600 uppercase font-display">
              Investor Trading Licence
            </span>
          </div>
          <ServiceCard segIdx={landed1} type="trading" />
        </div>

        {/* Wheel 2 */}
        <div className="flex flex-col items-center">
          <SpinWheel 
            segments={segments2} 
            onSpinDone={(idx) => {
              setLanded2(idx);
              onRewardWon?.(segments2[idx].label.join(" "));
            }} 
          />
          <div className="mt-12 px-6 py-2 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border-2 border-teal-100 shadow-sm text-center hover:scale-105 transition-transform duration-300">
            <span className="text-[13px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-indigo-600 uppercase font-display">
              Investor Service Licence
            </span>
          </div>
          <ServiceCard segIdx={landed2} type="service" />
        </div>

      </div>
    </div>
  );
}
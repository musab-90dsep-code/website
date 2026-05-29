import { useState, useRef, FormEvent, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import SaudiInvestmentLanding from "./components/SaudiInvestmentLanding";
import SpinningHub from "./components/SpinningHub";
import ConcertHub from "./components/ConcertHub";
import HappyClientsHub from "./components/HappyClientsHub";
import ServicesHub from "./components/ServicesHub";
import EPassportPage from "./components/EPassportPage";
import VisaApplicationPage from "./components/VisaApplicationPage";
import { Compass, RotateCw, Music, Users, Sparkles, Send, CheckCircle2, Building2, MessageCircle, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import AdminPanel from "./components/AdminPanel";
import { supabase } from "./lib/supabase";

const formatSocialLink = (platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube", value: string) => {
  if (!value) return "";
  const cleaned = value.trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return cleaned;
  }
  const domains: Record<string, string> = {
    facebook: "facebook.com",
    twitter: "twitter.com",
    instagram: "instagram.com",
    linkedin: "linkedin.com",
    youtube: "youtube.com"
  };
  const platformDomain = domains[platform];
  if (cleaned.toLowerCase().includes(platformDomain) || (platform === "twitter" && cleaned.toLowerCase().includes("x.com"))) {
    return `https://${cleaned}`;
  }
  const baseUrls: Record<string, string> = {
    facebook: "https://facebook.com/",
    twitter: "https://x.com/",
    instagram: "https://instagram.com/",
    linkedin: "https://linkedin.com/in/",
    youtube: "https://youtube.com/"
  };
  const handle = cleaned.startsWith("@") ? cleaned.slice(1) : cleaned;
  return `${baseUrls[platform]}${handle}`;
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"Spinning" | "Concert" | "Happy clients" | "Services">("Spinning");
  const [currentPage, setCurrentPage] = useState<"home" | "epassport" | "visa" | "admin">(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("admin") === "true" ? "admin" : "home";
  });
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [consultName, setConsultName] = useState("");
  const [consultDetail, setConsultDetail] = useState("");
  const [consultSubmitted, setConsultSubmitted] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [footerCompanyName, setFooterCompanyName] = useState("AL NAZIM TRAVELS CONSULTANCY");
  const [footerCopyright, setFooterCopyright] = useState("Copyright © 2026 Al Nazim Travels. Designed to exceed expectations.");
  const [socialFacebook, setSocialFacebook] = useState("https://facebook.com");
  const [socialTwitter, setSocialTwitter] = useState("https://x.com");
  const [socialInstagram, setSocialInstagram] = useState("https://instagram.com");
  const [socialLinkedin, setSocialLinkedin] = useState("https://linkedin.com");
  const [socialYoutube, setSocialYoutube] = useState("https://youtube.com");

  useEffect(() => {
    const fetchFooter = async () => {
      const { data } = await supabase.from("site_settings").select("key,value").in("key", [
        "footer_company_name",
        "footer_copyright",
        "social_facebook",
        "social_twitter",
        "social_instagram",
        "social_linkedin",
        "social_youtube"
      ]);
      if (data) {
        data.forEach((row: any) => {
          if (row.key === "footer_company_name") setFooterCompanyName(row.value);
          if (row.key === "footer_copyright") setFooterCopyright(row.value);
          if (row.key === "social_facebook") setSocialFacebook(row.value);
          if (row.key === "social_twitter") setSocialTwitter(row.value);
          if (row.key === "social_instagram") setSocialInstagram(row.value);
          if (row.key === "social_linkedin") setSocialLinkedin(row.value);
          if (row.key === "social_youtube") setSocialYoutube(row.value);
        });
      }
    };
    fetchFooter();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [currentPage]);

  const hubSectionRef = useRef<HTMLDivElement>(null);

  const handleRewardWon = (rewardText: string) => {
    setNotification(rewardText);
    setTimeout(() => {
      setNotification(null);
    }, 6000);
  };

  const scrollToHub = (tabName: string) => {
    setActiveTab(tabName as any);
    setTimeout(() => {
      hubSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleConsultSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setConsultSubmitted(true);

    // 1. Save to Supabase
    try {
      await supabase.from("leads").insert([{ name: consultName, requirement: consultDetail }]);
    } catch (err) {
      console.error("Failed to insert lead", err);
    }

    // 2. Dispatch Email Notification
    try {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "email_notification_key").single();
      if (data && data.value) {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: data.value,
            subject: `New Live Consultation Request - ${consultName}`,
            from_name: "Al Naseem Travels Hub",
            name: consultName,
            message: `Client ${consultName} has requested a Live Consultation. Details: "${consultDetail}".`
          })
        });
      }
    } catch (err) {
      console.error("Failed to send consult email", err);
    }

    setTimeout(() => {
      setConsultSubmitted(false);
      setShowConsultForm(false);
      setConsultName("");
      setConsultDetail("");
    }, 3000);
  };

  const handleSubpageNavigation = (section?: string) => {
    setCurrentPage("home");
    if (section) {
      setTimeout(() => {
        if (section === "service" || section === "Services") {
          scrollToHub("Services");
        } else {
          const idMap: Record<string, string> = {
            home: "homepage",
            why: "why-choose-us",
            contact: "contact"
          };
          const elementId = idMap[section] || section;
          const el = document.getElementById(elementId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }, 150);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100 flex flex-col justify-between selection:bg-rose-200 selection:text-slate-900">

      {/* Dynamic Celebration Pop-up / Notification Bar when winning a reward */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.9 }}
            className="fixed top-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-slate-900 text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(244,63,94,0.15)] border border-rose-500 z-50 flex items-start gap-3"
          >
            <div className="bg-rose-100 p-2 rounded-lg text-rose-600 flex-none shrink-0 animate-bounce">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="font-bold text-sm tracking-wide text-white uppercase">Congratulations!</div>
              <p className="text-rose-200 text-xs font-medium leading-relaxed">
                You won a <span className="font-bold text-white bg-rose-500/30 px-1.5 py-0.5 rounded">{notification}</span>! Show this screen to our staff to claim your reward.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {currentPage === "admin" ? (
        <AdminPanel onBack={() => setCurrentPage("home")} />
      ) : currentPage === "epassport" ? (
        <EPassportPage onBack={handleSubpageNavigation} />
      ) : currentPage === "visa" ? (
        <VisaApplicationPage onBack={handleSubpageNavigation} />
      ) : (
        <>
          {/* SECTION 1: SAUDI INVESTMENT PRIMARY LANDING PAGE AND INTEGRATED HOOK */}
          <SaudiInvestmentLanding
            onCallForVisit={() => {
              scrollToHub("Services");
            }}
            onNavigateToHubSection={(tab) => {
              scrollToHub(tab);
            }}
            onNavigateToEPassport={() => setCurrentPage("epassport")}
            onNavigateToVisa={() => setCurrentPage("visa")}
          >
            {/* SECTION 2: INTERACTIVE CUSTOMER ENGAGEMENT HUB */}
            <section
              ref={hubSectionRef}
              id="category-hub"
              className="py-20 px-4 md:px-12 bg-white border-t border-b border-slate-200"
            >
              <div className="max-w-5xl mx-auto space-y-12">



                {/* Dynamic Pivot of Active Visual Interface with Framer Motion */}
                <div className="relative">
                  <AnimatePresence mode="wait">
                    {activeTab === "Spinning" && (
                      <motion.div
                        key="spinning-segment"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SpinningHub onRewardWon={handleRewardWon} />
                      </motion.div>
                    )}

                    {activeTab === "Concert" && (
                      <motion.div
                        key="concert-segment"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ConcertHub />
                      </motion.div>
                    )}

                    {activeTab === "Happy clients" && (
                      <motion.div
                        key="clients-segment"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <HappyClientsHub />
                      </motion.div>
                    )}

                    {activeTab === "Services" && (
                      <motion.div
                        key="services-segment"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ServicesHub />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Centered Pink/Rose "Consult" Interactive Circle matching Mockup center placement */}
                {/* Centered Image Consult Button */}
                <div id="quick-consult-trigger" className="pt-12 flex flex-col items-center">
                  <a href="#contact" className="relative group flex flex-col items-center no-underline cursor-pointer">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-[3px] border-rose-500 shadow-md group-hover:scale-105 transition-all duration-300 relative z-20">
                      <img src="/image.webp" alt="Consultant" className="w-full h-full object-cover object-top" />
                    </div>

                    <span className="mt-4 text-rose-500 font-display font-black text-sm uppercase tracking-widest group-hover:text-rose-600 transition-colors drop-shadow-sm">
                      BOOK NOW
                    </span>
                  </a>
                  <span className="text-slate-500 text-[11px] font-mono mt-1 uppercase tracking-wider font-bold">
                    Centrally Dispatch Live Query Desk
                  </span>
                </div>

              </div>
            </section>
          </SaudiInvestmentLanding>

          {/* SECTION 3: FOOTER SECTION (Refined under Vibrant Palette) */}
          <footer id="contact" className="bg-slate-950 text-slate-400 py-12 px-6 md:px-16 border-t border-white/5 relative overflow-hidden">
            {/* Subtle premium background glow */}
            <div className="absolute top-0 left-1/3 w-72 h-72 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              
              {/* Left Column: Premium Logo & Company Name */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="border-2 border-rose-500/20 bg-rose-500/10 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-rose-500/5">
                  <Building2 className="h-4.5 w-4.5 text-rose-400" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display font-black text-xs tracking-wider text-white uppercase">
                    {footerCompanyName}
                  </span>
                  <span className="text-[8px] text-orange-400/80 font-mono font-bold tracking-widest uppercase mt-0.5">
                    JEDDAH · SAUDI ARABIA
                  </span>
                </div>
              </div>
              
              {/* Center Column: Beautifully Organized Social Hub */}
              <div className="flex flex-col items-center justify-center gap-2">
                {(socialFacebook || socialTwitter || socialInstagram || socialLinkedin || socialYoutube) && (
                  <>
                    <div className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase mb-1">
                      Follow Us
                    </div>
                    <div className="flex items-center gap-3">
                      {socialFacebook && (
                        <a
                          href={formatSocialLink("facebook", socialFacebook)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-slate-900/60 border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(244,63,94,0.15)] shadow-sm"
                          title="Facebook"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      {socialTwitter && (
                        <a
                          href={formatSocialLink("twitter", socialTwitter)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-slate-900/60 border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(244,63,94,0.15)] shadow-sm"
                          title="Twitter / X"
                        >
                          <Twitter className="h-4 w-4" />
                        </a>
                      )}
                      {socialInstagram && (
                        <a
                          href={formatSocialLink("instagram", socialInstagram)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-slate-900/60 border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(244,63,94,0.15)] shadow-sm"
                          title="Instagram"
                        >
                          <Instagram className="h-4 w-4" />
                        </a>
                      )}
                      {socialLinkedin && (
                        <a
                          href={formatSocialLink("linkedin", socialLinkedin)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-slate-900/60 border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(244,63,94,0.15)] shadow-sm"
                          title="LinkedIn"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                      {socialYoutube && (
                        <a
                          href={formatSocialLink("youtube", socialYoutube)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-slate-900/60 border border-white/5 hover:border-rose-500/40 hover:bg-rose-500/10 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(244,63,94,0.15)] shadow-sm"
                          title="YouTube"
                        >
                          <Youtube className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Right Column: Sleek Copyright & Secure Portal Link */}
              <div className="flex flex-col items-center md:items-end gap-2 flex-shrink-0 text-center md:text-right">
                <p className="text-[10px] tracking-widest text-slate-500 font-medium">
                  {footerCopyright}
                </p>
                <a
                  href="/?admin=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-rose-400 transition-all duration-300 text-[8px] font-mono tracking-widest uppercase bg-transparent border-0 cursor-pointer p-0 flex items-center gap-1.5 no-underline hover:underline"
                >
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  [ SECURE ADMIN PORTAL ]
                </a>
              </div>

            </div>
          </footer>
        </>
      )}

      {/* Real-time Consult Messaging Drawer/Overlay */}
      <AnimatePresence>
        {showConsultForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500 animate-ping" />
                  <span className="font-bold text-sm text-slate-800 font-display">Live Consult Messenger</span>
                </div>
                <button
                  onClick={() => setShowConsultForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {!consultSubmitted ? (
                <form onSubmit={handleConsultSubmit} className="space-y-3.5">
                  <p className="text-xs text-slate-500 leading-normal">
                    This consult dispatcher matches you directly to our senior business and travel consultants in Jeddah.
                  </p>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={consultName}
                      onChange={(e) => setConsultName(e.target.value)}
                      placeholder="e.g. Sultan Al-Rashid"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold text-slate-500 mb-1">Your Special Requirement</label>
                    <textarea
                      required
                      value={consultDetail}
                      onChange={(e) => setConsultDetail(e.target.value)}
                      rows={3}
                      placeholder="e.g. Looking to apply for an Investor Trading License, e-passport processing, or comprehensive visa services."
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-rose-500/20"
                  >
                    <Send className="h-3 w-3" />
                    DISPATCH CONSULTATION
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-rose-500 mx-auto animate-bounce" />
                  <h5 className="font-bold text-sm text-slate-900 font-display">Consult Request Dispatched</h5>
                  <p className="text-xs text-slate-600">
                    Excellent choice, <span className="font-bold">{consultName}</span>. Your dispatch queue reference was generated. Our team will contact you in a few minutes.
                  </p>
                  <div className="text-[10px] font-mono text-rose-600 font-bold bg-rose-50 px-2.5 py-1 rounded-full inline-block">
                    QUEUE POSITION: VIP-01
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

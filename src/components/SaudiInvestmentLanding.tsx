import { useState, useEffect, FormEvent, ReactNode } from "react";
import { PhoneCall, DollarSign, Award, Sparkles, Mail, MapPin, FileText, Plane, Star, Quote } from "lucide-react";
import { supabase } from "../lib/supabase";
import OurServices from "./OurServices";
import HappyClientsHub from "./HappyClientsHub";

// Dynamic icon resolver
const ICON_MAP: Record<string, any> = { FileText, Plane, DollarSign, Award, Star, Sparkles, Mail, MapPin };
const getIcon = (name: string) => ICON_MAP[name] || FileText;

// Color maps for dynamic feature cards
const BORDER_COLOR: Record<string, string> = { rose: "hover:border-rose-400 hover:bg-rose-50/40", orange: "hover:border-orange-400 hover:bg-orange-50/40", teal: "hover:border-teal-400 hover:bg-teal-50/40", indigo: "hover:border-indigo-400 hover:bg-indigo-50/40", emerald: "hover:border-emerald-400 hover:bg-emerald-50/40", amber: "hover:border-amber-400 hover:bg-amber-50/40" };
const ICON_COLOR: Record<string, string> = { rose: "bg-rose-100 text-rose-600", orange: "bg-orange-100 text-orange-600", teal: "bg-teal-100 text-teal-600", indigo: "bg-indigo-100 text-indigo-600", emerald: "bg-emerald-100 text-emerald-600", amber: "bg-amber-100 text-amber-600" };

type FeatureCard = { id: string; title: string; description: string; icon_name: string; color: string; order_num: number };

// Default settings fallback so site never looks empty while loading
const DEFAULT_SETTINGS: Record<string, string> = {
  hero_image_url: "/image.png",
  hero_badge_text: "Saudi Business Consultancy",
  hero_title_line1: "AL NAZIM",
  hero_title_line2: "TRAVELS.",
  hero_location: "Jeddah · Saudi Arabia",
  hero_tagline: "Your trusted partner for premium corporate setup, investor licensing, fast e-passports, and comprehensive visa services.",
  hero_cta_button: "Contact Our Experts",
  brand_name: "AL NAZIM TRAVELS",
  brand_sub: "Jeddah · Saudi Arabia",
  brand_logo_text: "A",
  brand_logo_image_url: "",
  email_notification_key: "",
  passport_whatsapp: "+966598327617",
  passport_contact_title: "Live Query Desk",
  passport_contact_subtitle: "Get in touch with our experts. We're ready to answer your E-Passport questions.",
  passport_contact_phone: "",
  passport_contact_email: "",
  passport_contact_address: "",
  visa_whatsapp: "+966598327617",
  visa_contact_title: "Live Query Desk",
  visa_contact_subtitle: "Get in touch with our experts. We're ready to answer your Visa questions.",
  visa_contact_phone: "",
  visa_contact_email: "",
  visa_contact_address: "",
  why_choose_title: "Why Choose Us",
  why_choose_para1: "At Al Nazim Travels, we believe in delivering uncompromising quality, speed, and transparency. Our team of seasoned professionals is dedicated to simplifying complex procedures—from E-Passport processing to Visa applications—ensuring you achieve your goals without the usual hassle.",
  why_choose_para2: "We pride ourselves on our deep industry knowledge and our commitment to putting clients first. Every application is handled with the utmost care, giving you peace of mind and guaranteeing a smooth, efficient experience from start to finish.",
  contact_phone: "+966 50 111 2222",
  contact_email: "info@alnazimtravels.com",
  contact_address: "Jeddah, Saudi Arabia",
  contact_whatsapp: "+966501112222",
  services_section_title: "Our Service",
  services_section_subtitle: "Providing reliable E-Passport & Visa application services",
  testimonials_section_title: "Our Happy Clients",
  testimonials_section_subtitle: "Don't just take our word for it. See what our valued clients have to say about our fast, reliable, and professional services.",
};

const DEFAULT_CARDS: FeatureCard[] = [
  { id: "1", title: "E-Passport Application", description: "Hassle-free and fast E-Passport application processing. We guide you through the entire process.", icon_name: "FileText", color: "rose", order_num: 1 },
  { id: "2", title: "Visa Application", description: "Expert assistance for your Visa applications. Whether for business, tourism, or work, our team ensures accuracy.", icon_name: "Plane", color: "orange", order_num: 2 },
  { id: "3", title: "Affordable & Transparent Pricing", description: "No hidden costs — just fair, upfront pricing for all our visa, e-passport, and consultancy services.", icon_name: "DollarSign", color: "teal", order_num: 3 },
  { id: "4", title: "Quality Workmanship Guaranteed", description: "We take pride in every job. Our work is backed by professional standards and guaranteed satisfaction.", icon_name: "Award", color: "indigo", order_num: 4 },
];

export default function SaudiInvestmentLanding({
  onNavigateToHubSection,
  onNavigateToEPassport,
  onNavigateToVisa,
  children,
}: {
  onCallForVisit?: () => void;
  onNavigateToHubSection?: (tab: string) => void;
  onNavigateToEPassport?: () => void;
  onNavigateToVisa?: () => void;
  children?: ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULT_SETTINGS);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>(DEFAULT_CARDS);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteService, setQuoteService] = useState("E-Passport Application");
  const [queryName, setQueryName] = useState("");
  const [queryPhone, setQueryPhone] = useState("");

  const s = (key: string) => settings[key] || DEFAULT_SETTINGS[key] || "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Fetch all settings + feature cards in parallel
    const fetchData = async () => {
      const [settingsRes, cardsRes] = await Promise.all([
        supabase.from("site_settings").select("key,value"),
        supabase.from("feature_cards").select("*").order("order_num"),
      ]);

      if (settingsRes.data && settingsRes.data.length > 0) {
        const map: Record<string, string> = { ...DEFAULT_SETTINGS };
        settingsRes.data.forEach((row: any) => { map[row.key] = row.value; });
        setSettings(map);
      }
      if (cardsRes.data && cardsRes.data.length > 0) {
        setFeatureCards(cardsRes.data);
      }
      setDataLoaded(true);
    };
    fetchData();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuoteSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setQuoteStatus("submitting");

    // 1. Save to Supabase Leads
    try {
      const requirementText = `[Quote Request] Phone: ${quotePhone} | Requested Solution: ${quoteService}`;
      await supabase.from("leads").insert([{ name: quoteName, requirement: requirementText }]);
    } catch (err) {
      console.error("Failed to save quote lead", err);
    }

    // 2. Dispatch Email Notification
    const emailKey = s("email_notification_key");
    if (emailKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: emailKey,
            subject: `New Quote Request from ${quoteName}`,
            from_name: "Al Naseem Travels Hub",
            name: quoteName,
            phone: quotePhone,
            requested_service: quoteService,
            message: `Client ${quoteName} has requested a quote for the service: "${quoteService}". Saudi Phone: ${quotePhone}.`
          })
        });
      } catch (err) {
        console.error("Failed to send email notification", err);
      }
    }

    setQuoteStatus("done");
  };

  return (
    <div className="font-sans text-slate-900 antialiased bg-slate-50 min-h-screen">

      {/* ── NAVBAR ───────────────────────────────────────────────────────── */}
      <nav id="top-navigation" className={`h-[68px] px-4 md:px-12 flex items-center justify-between fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${scrolled ? "bg-slate-900/95 backdrop-blur-lg border-b border-white/10 shadow-lg" : "bg-transparent border-b border-white/5"}`}>
        <div className="flex items-center gap-3">
          {s("brand_logo_image_url") ? (
            <img src={s("brand_logo_image_url")} alt="Logo" className="w-9 h-9 object-cover rounded-xl shadow-lg border border-white/10" />
          ) : (
            <div className="w-9 h-9 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-rose-500/40 italic text-xl">
              {s("brand_logo_text") || "A"}
            </div>
          )}
          <div className="flex flex-col leading-none">
            <span className="font-display font-black text-sm tracking-tight text-white">{s("brand_name")}</span>
            <span className="text-[9px] text-orange-400 font-mono font-bold tracking-wider uppercase">{s("brand_sub")}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center bg-slate-950/60 backdrop-blur-md border border-white/15 rounded-full px-2.5 py-1.5 gap-1 shadow-lg">
          {[{ label: "Home", href: "#homepage" }, { label: "Service", href: "#service" }, { label: "Why Us", href: "#why-choose-us" }, { label: "Contact", href: "#contact" }].map(link => (
            <a key={link.href} href={link.href} className="px-4 py-1.5 rounded-full text-xs font-bold text-white/90 hover:text-white hover:bg-white/15 transition-all duration-200 no-underline visited:text-white/90">
              {link.label}
            </a>
          ))}
        </div>
        <button onClick={() => setShowQuoteModal(true)} className="relative overflow-hidden bg-gradient-to-r from-rose-500 to-orange-500 text-white px-5 py-2.5 rounded-full hover:from-rose-600 hover:to-orange-600 transition-all font-bold text-xs shadow-lg shadow-rose-500/30 hover:scale-105 flex items-center gap-2">
          <span>Get Quote</span>
          <span className="text-rose-200">→</span>
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section id="homepage" className="relative min-h-[600px] text-white py-20 px-4 md:px-12 flex flex-col justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src={dataLoaded ? s("hero_image_url") : undefined}
            alt="Hero"
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ${dataLoaded ? "opacity-100" : "opacity-0"}`}
          />
          <div className="absolute inset-x-0 top-0 h-[180px] bg-gradient-to-b from-slate-950/80 via-slate-950/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[350px] bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
        </div>

        {/* Decorative bars */}
        <div className="absolute left-6 md:left-20 bottom-10 hidden lg:block w-72 h-44 z-10 pointer-events-none">
          <div className="relative w-full h-full flex items-end gap-3">
            <div className="w-8 bg-gradient-to-t from-rose-600 to-rose-400 rounded h-[110px] shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse" />
            <div className="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded h-[140px] shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
            <div className="w-8 bg-gradient-to-t from-teal-600 to-teal-400 rounded h-[90px] shadow-[0_0_10px_rgba(20,184,166,0.4)]" />
            <div className="w-8 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded h-[130px]" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-20 space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/40 border border-white/20 text-orange-400 font-mono font-bold text-[10px] md:text-xs uppercase tracking-widest mx-auto shadow-md backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {s("hero_badge_text")}
          </div>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight text-center tracking-tighter font-display uppercase drop-shadow-xl">
            <span className="block overflow-hidden py-1.5">
              <span className="block animate-title-scroll">
                {s("hero_title_line1")}
              </span>
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 block mt-1">
              {s("hero_title_line2")}
            </span>
          </h1>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs md:text-sm font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-md">
              {s("hero_location")}
            </span>
            <p className="text-white/95 text-sm md:text-xl text-center max-w-2xl mx-auto leading-relaxed drop-shadow font-medium mt-2">
              {s("hero_tagline")}
            </p>
          </div>
          <div className="pt-4 flex justify-center">
            <a href="#contact" className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white font-display text-xs font-bold py-3.5 px-8 rounded-full shadow-lg shadow-rose-500/30 transition-all hover:scale-105 inline-flex items-center gap-2 no-underline cursor-pointer">
              <PhoneCall className="h-4 w-4" />
              {s("hero_cta_button")}
            </a>
          </div>
        </div>
      </section>

      {/* ── CHILDREN (Spin Hub, etc.) ─────────────────────────────────────── */}
      {children}

      {/* ── WHY CHOOSE US ────────────────────────────────────────────────── */}
      <section id="why-choose-us" className="py-20 bg-white px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 font-display leading-tight uppercase tracking-tight">
            {s("why_choose_title")}
          </h2>
          <div className="space-y-6 text-slate-600 text-base md:text-lg leading-relaxed font-medium">
            <p>{s("why_choose_para1")}</p>
            <p>{s("why_choose_para2")}</p>
          </div>
        </div>
      </section>

      {/* ── OUR SERVICES ─────────────────────────────────────────────────── */}
      <OurServices
        title={s("services_section_title")}
        subtitle={s("services_section_subtitle")}
        featureCards={featureCards}
        onNavigateToEPassport={onNavigateToEPassport}
        onNavigateToVisa={onNavigateToVisa}
      />

      {/* ── HAPPY CLIENTS ────────────────────────────────────────────────── */}
      <section className="py-20 bg-white px-4 md:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 font-bold text-[10px] uppercase tracking-widest mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-display tracking-tight uppercase">
              {s("testimonials_section_title")}
            </h2>
            <p className="text-sm text-slate-500 font-medium max-w-2xl mx-auto">
              {s("testimonials_section_subtitle")}
            </p>
          </div>
          <HappyClientsHub />
        </div>
      </section>

      {/* ── CONTACT SECTION ──────────────────────────────────────────────── */}
      <section id="contact" className="py-16 bg-white px-4 md:px-12">
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 text-center">
          <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight uppercase mb-2">Live Query Desk</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto">Get in touch with our experts. We're ready to answer your questions and provide personalized consultation.</p>
          <div className="flex flex-col md:flex-row gap-8 justify-center max-w-2xl mx-auto text-left">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hotline</div>
                  <div className="font-bold text-slate-800">{s("contact_phone")}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Support</div>
                  <div className="font-bold text-slate-800">{s("contact_email")}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headquarters</div>
                  <div className="font-bold text-slate-800">{s("contact_address")}</div>
                </div>
              </div>
            </div>
            <div className="flex-1 space-y-3">
              <input 
                type="text" 
                placeholder="Your Name" 
                value={queryName}
                onChange={e => setQueryName(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500" 
              />
              <input 
                type="tel" 
                placeholder="Phone Number" 
                value={queryPhone}
                onChange={e => setQueryPhone(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500" 
              />
              <a
                href={`https://wa.me/${s("contact_whatsapp").replace(/\D/g, "")}?text=${encodeURIComponent(
                  `Hello! My name is ${queryName || "Client"} and my phone is ${queryPhone || "Not Provided"}. I would like to consult about Saudi Business Hub.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg shadow-md hover:bg-green-600 transition-colors no-underline cursor-pointer"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── GET QUOTE MODAL ──────────────────────────────────────────────── */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-base text-slate-900 font-display">Get Fast Quote</h4>
                <p className="text-xs text-slate-500">Response within 15 minutes guaranteed</p>
              </div>
              <button onClick={() => { setShowQuoteModal(false); setQuoteStatus("idle"); }} className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1">✕</button>
            </div>
            {quoteStatus !== "done" ? (
              <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono mb-1">Your Full Name</label>
                  <input type="text" required value={quoteName} onChange={e => setQuoteName(e.target.value)} placeholder="e.g. Fahad Al-Saeed" className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono mb-1">Saudi Phone Number</label>
                  <input type="tel" required value={quotePhone} onChange={e => setQuotePhone(e.target.value)} placeholder="e.g. +966 50 111 2222" className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono mb-1">Requested Solution</label>
                  <select value={quoteService} onChange={e => setQuoteService(e.target.value)} className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-rose-500">
                    {featureCards.map(c => <option key={c.id}>{c.title}</option>)}
                  </select>
                </div>
                <button type="submit" disabled={quoteStatus === "submitting"} className="w-full py-2 bg-rose-500 text-white text-xs font-semibold rounded-full hover:bg-rose-600 transition-all font-display uppercase tracking-widest">
                  {quoteStatus === "submitting" ? "Requesting..." : "SUBMIT REQUEST"}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2">
                <Award className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
                <h5 className="font-bold text-sm text-slate-900 font-display">Quote Locked Successfully</h5>
                <p className="text-xs text-slate-600 leading-normal">Thank you, <span className="font-bold">{quoteName}</span>. Our team will ring you back shortly.</p>
                <button type="button" onClick={() => { setShowQuoteModal(false); setQuoteStatus("idle"); }} className="px-5 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded-full hover:bg-slate-200 mt-2 font-mono">
                  CLOSE WINDOW
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

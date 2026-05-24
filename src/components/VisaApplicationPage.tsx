import React, { useEffect, useState } from "react";
import { ArrowLeft, FileText, Plane, MapPin, CheckCircle2, PhoneCall, Mail, CreditCard, Award } from "lucide-react";
import { supabase } from "../lib/supabase";

type VisaCountry = { id: string; name: string; type: string; desc_text: string; icon_bg: string; icon_color: string; order_num: number };

export default function VisaApplicationPage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState("ভিসা আবেদন");
  const [subtitle, setSubtitle] = useState("আমরা বিশ্বের বিভিন্ন দেশের ভিসা প্রসেসিং করে থাকি। আপনার প্রয়োজনীয় দেশের ভিসা নির্বাচন করুন এবং ঝামেলামুক্ত সেবা উপভোগ করুন।");
  const [destTitle, setDestTitle] = useState("আমাদের ভিসা গন্তব্যসমূহ");
  const [destSubtitle, setDestSubtitle] = useState("নিচে উল্লেখিত দেশগুলোর জন্য আমরা অত্যন্ত বিশ্বস্ততার সাথে ভিসা প্রসেসিং করে থাকি।");
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/966598327617");
  const [queryName, setQueryName] = useState("");
  const [queryPhone, setQueryPhone] = useState("");

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteService, setQuoteService] = useState("Visa Application");

  const getVisaQueryWhatsapp = () => {
    const num = (settings.visa_whatsapp || settings.contact_whatsapp || "966598327617").replace(/\D/g, "");
    let text = "Hello! I would like to consult about Visa Services.";
    if (queryName) text += ` My name is ${queryName}.`;
    if (queryPhone) text += ` My phone number is ${queryPhone}.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const getWhatsappLinkForCountry = (countryName: string) => {
    const wpNum = settings.visa_whatsapp || settings.contact_whatsapp || "966598327617";
    const cleanNum = wpNum.replace(/\D/g, "");
    return `https://wa.me/${cleanNum}?text=Hello!%20I%20am%20interested%20in%20applying%20for%20a%20visa%20for%20${encodeURIComponent(countryName)}.`;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStatus("submitting");

    // 1. Save to Supabase Leads
    try {
      const requirementText = `[Visa Quote Request] Phone: ${quotePhone} | Requested Solution: ${quoteService}`;
      await supabase.from("leads").insert([{ name: quoteName, requirement: requirementText }]);
    } catch (err) {
      console.error("Failed to save quote lead", err);
    }

    // 2. Dispatch Email Notification
    const emailKey = settings.email_notification_key;
    if (emailKey) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: emailKey,
            subject: `New Visa Quote Request from ${quoteName}`,
            from_name: "Al Naseem Travels Hub",
            name: quoteName,
            phone: quotePhone,
            requested_service: quoteService,
            message: `Client ${quoteName} has requested a Visa quote. Saudi Phone: ${quotePhone}.`
          })
        });
      } catch (err) {
        console.error("Failed to send email notification", err);
      }
    }

    setQuoteStatus("done");
  };

  useEffect(() => {
    const loadData = async () => {
      const [settingsRes, countriesRes] = await Promise.all([
        supabase.from("site_settings").select("*"),
        supabase.from("visa_countries").select("*").order("order_num")
      ]);

      if (settingsRes.data) {
        const map: Record<string, string> = {};
        settingsRes.data.forEach(s => map[s.key] = s.value);
        setSettings(map);
        if (map.visa_page_title) setTitle(map.visa_page_title);
        if (map.visa_page_subtitle) setSubtitle(map.visa_page_subtitle);
        if (map.visa_destinations_title) setDestTitle(map.visa_destinations_title);
        if (map.visa_destinations_subtitle) setDestSubtitle(map.visa_destinations_subtitle);
        
        const wpNum = map.visa_whatsapp || map.contact_whatsapp || "966598327617";
        const cleanNum = wpNum.replace(/\D/g, "");
        setWhatsappLink(`https://wa.me/${cleanNum}?text=Hello!%20I%20want%20to%20apply%20for%20a%20Visa.`);
      }

      if (countriesRes.data && countriesRes.data.length > 0) {
        setCountries(countriesRes.data);
      } else {
        // Fallback
        setCountries([
          { id: "1", name: "সৌদি আরব", type: "কাজের, উমরাহ এবং ভিজিট ভিসা", desc_text: "আমাদের মাধ্যমে দ্রুত এবং বিশ্বস্ততার সাথে আপনার সৌদি ভিসা প্রসেস করুন। উমরাহ, বিজনেস এবং কাজের ভিসার জন্য সম্পূর্ণ গাইডলাইন ও সহায়তা প্রদান করা হয়।", icon_bg: "bg-emerald-100", icon_color: "text-emerald-600", order_num: 1 },
          { id: "2", name: "সংযুক্ত আরব আমিরাত (ইউএই)", type: "ট্যুরিস্ট এবং বিজনেস ভিসা", desc_text: "দুবাই এবং সংযুক্ত আরব আমিরাতের ভিসা প্রসেসিং দ্রুততম সময়ে করুন। ট্যুরিস্ট, ট্রানজিট এবং বিজনেস ভ্রমণকারীদের জন্য আদর্শ সার্ভিস।", icon_bg: "bg-blue-100", icon_color: "text-blue-600", order_num: 2 },
          { id: "3", name: "কাতার", type: "ভিজিট এবং কাজের ভিসা", desc_text: "ঝামেলামুক্ত কাতার ভিসা প্রসেসিং সেবা, যার মধ্যে প্রয়োজনীয় কাগজপত্র সত্যায়ন এবং যথাযথ আবেদন সাবমিশন অন্তর্ভুক্ত রয়েছে।", icon_bg: "bg-purple-100", icon_color: "text-purple-600", order_num: 3 },
          { id: "4", name: "ওমান", type: "চাকরি এবং ভিজিট ভিসা", desc_text: "ওমান ভিসার আবেদনের জন্য নিখুঁত প্রফেশনাল সাপোর্ট। আপনার সব প্রয়োজনীয় ডকুমেন্ট সঠিক সময়ে প্রস্তুত করার নিশ্চয়তা।", icon_bg: "bg-rose-100", icon_color: "text-rose-600", order_num: 4 },
          { id: "5", name: "ইউরোপ (সেনজেন)", type: "ট্যুরিস্ট এবং স্টুডেন্ট ভিসা", desc_text: "ইউরোপ সেনজেন ভিসার জন্য সম্পূর্ণ প্রফেশনাল গাইডলাইন। ভ্রমণ পরিকল্পনা সাজানো, ট্রাভেল ইন্সুরেন্স এবং ফাইল প্রিপারেশনে সাহায্য করা হবে।", icon_bg: "bg-indigo-100", icon_color: "text-indigo-600", order_num: 5 },
          { id: "6", name: "মালয়েশিয়া", type: "ট্যুরিস্ট এবং মেডিকেল ভিসা", desc_text: "সর্বনিম্ন কাগজপত্রের মাধ্যমে খুব সহজেই মালয়েশিয়ান ই-ভিসা এবং স্টিকার ভিসা প্রসেসিংয়ের নির্ভরযোগ্য সেবা।", icon_bg: "bg-amber-100", icon_color: "text-amber-600", order_num: 6 }
        ]);
      }
    };
    loadData();
  }, []);

  return (
    <div className="font-sans text-slate-900 antialiased bg-slate-50 min-h-screen pb-20">
      {/* Navigation Bar */}
      <nav className="h-[64px] bg-slate-900/90 border-b border-white/10 px-4 md:px-12 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/30 italic text-xl">S</div>
          <span className="font-display font-black text-sm md:text-base tracking-tight text-white">SAUDI INVESTMENT</span>
        </div>
        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <span className="text-orange-400">{title}</span>
        </div>
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all px-4 py-2 rounded-lg font-semibold text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          হোমে ফিরে যান
        </button>
      </nav>

      {/* Cover Photo Section */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-slate-900">
        <img
          src={settings.visa_cover_image_url || "/epassport_cover.png"}
          alt="Visa Services"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-200 font-bold text-[10px] uppercase tracking-widest mb-4">
            <Plane className="w-3.5 h-3.5" />
            <span>ভিসা প্রসেসিং সার্ভিস</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-display tracking-tight drop-shadow-lg">
            {title}
          </h1>
          <p className="mt-4 text-slate-300 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Main Content - Countries */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">

          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight">
              {destTitle}
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              {destSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country) => (
              <div key={country.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${country.icon_bg} ${country.icon_color} group-hover:scale-110 transition-transform`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{country.name}</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  {country.type}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {country.desc_text}
                </p>
                <a 
                  href={getWhatsappLinkForCountry(country.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center gap-2 text-rose-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer no-underline"
                >
                  বিস্তারিত জানুন <ArrowLeft className="w-4 h-4 rotate-180" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center border-b border-slate-100 pb-12">
            <button 
              onClick={() => setShowQuoteModal(true)}
              className="bg-rose-500 text-white px-8 py-4 rounded-xl hover:bg-rose-600 transition-all font-display font-black text-sm tracking-widest shadow-xl shadow-rose-500/30 hover:scale-105 inline-flex items-center gap-2 no-underline cursor-pointer border-0"
            >
              <CreditCard className="w-5 h-5" />
              এখনই আবেদন করুন
            </button>
            <p className="mt-4 text-xs text-slate-400 font-mono">ঝামেলামুক্ত এবং নির্ভরযোগ্য উপায়ে আবেদন করুন আমাদের বিশেষজ্ঞ টিমের মাধ্যমে।</p>
          </div>

          {/* ── LIVE QUERY DESK ────────────────────────────────────────────── */}
          <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 text-center">
            <h2 className="text-2xl font-black text-slate-900 font-display tracking-tight uppercase mb-2">
              {settings.visa_contact_title || "Live Query Desk"}
            </h2>
            <p className="text-xs text-slate-500 mb-8 max-w-lg mx-auto">
              {settings.visa_contact_subtitle || "Get in touch with our experts. We're ready to answer your questions and provide personalized consultation."}
            </p>
            <div className="flex flex-col md:flex-row gap-8 justify-center text-left">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hotline</div>
                    <div className="font-bold text-slate-800 break-all text-xs md:text-sm lg:text-base">
                      {settings.visa_contact_phone || settings.contact_phone || "+966 50 111 2222"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Support</div>
                    <div className="font-bold text-slate-800 break-all text-xs md:text-sm lg:text-base">
                      {settings.visa_contact_email || settings.contact_email || "info@alnazimtravels.com"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headquarters</div>
                    <div className="font-bold text-slate-800 break-all text-xs md:text-sm lg:text-base">
                      {settings.visa_contact_address || settings.contact_address || "Jeddah, Saudi Arabia"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 space-y-3">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  value={queryName}
                  onChange={e => setQueryName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-rose-500" 
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={queryPhone}
                  onChange={e => setQueryPhone(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-rose-500" 
                />
                <a
                  href={getVisaQueryWhatsapp()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg shadow-md hover:bg-green-600 transition-colors no-underline cursor-pointer"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

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
                    <option value="Visa Application">Visa Application</option>
                    <option value="E-Passport Application">E-Passport Application</option>
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

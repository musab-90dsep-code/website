import React, { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, UploadCloud, CreditCard, UserCheck, Plane, DollarSign, Award, Star, Building2, Sparkles, PhoneCall, Mail, MapPin } from "lucide-react";
import { supabase } from "../lib/supabase";

const IconMap: Record<string, any> = {
  FileText, Plane, DollarSign, Award, Star, Building2, Sparkles, CheckCircle2, UserCheck, UploadCloud
};

type EPassportRequirement = { id: string; title: string; desc_text: string; icon_name: string; color: string; order_num: number };

export default function EPassportPage({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState("ই-পাসপোর্ট আবেদন");
  const [subtitle, setSubtitle] = useState("দ্রুত, নির্ভরযোগ্য এবং ঝামেলামুক্ত ই-পাসপোর্ট প্রসেসিং। আপনার আবেদন যাতে কোনো বিলম্ব ছাড়া অনুমোদিত হয়, সে জন্য আমরা প্রতিটি ধাপে আপনাকে সাহায্য করব।");
  const [reqTitle, setReqTitle] = useState("আবেদনের জন্য যা যা লাগবে");
  const [reqSubtitle, setReqSubtitle] = useState("আপনার ই-পাসপোর্ট আবেদন শুরু করার আগে অনুগ্রহ করে নিচের কাগজপত্রগুলো সংগ্রহ করুন।");
  const [requirements, setRequirements] = useState<EPassportRequirement[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [whatsappLink, setWhatsappLink] = useState("https://wa.me/966598327617");
  const [queryName, setQueryName] = useState("");
  const [queryPhone, setQueryPhone] = useState("");

  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteService, setQuoteService] = useState("E-Passport Application");

  const getEPassportQueryWhatsapp = () => {
    const num = (settings.passport_whatsapp || settings.contact_whatsapp || "966598327617").replace(/\D/g, "");
    let text = "Hello! I would like to consult about E-Passport Services.";
    if (queryName) text += ` My name is ${queryName}.`;
    if (queryPhone) text += ` My phone number is ${queryPhone}.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStatus("submitting");

    // 1. Save to Supabase Leads
    try {
      const requirementText = `[Passport Quote Request] Phone: ${quotePhone} | Requested Solution: ${quoteService}`;
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
            subject: `New E-Passport Quote Request from ${quoteName}`,
            from_name: "Al Naseem Travels Hub",
            name: quoteName,
            phone: quotePhone,
            requested_service: quoteService,
            message: `Client ${quoteName} has requested an E-Passport quote. Saudi Phone: ${quotePhone}.`
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
      const [settingsRes, reqsRes] = await Promise.all([
        supabase.from("site_settings").select("*"),
        supabase.from("epassport_requirements").select("*").order("order_num")
      ]);

      if (settingsRes.data) {
        const map: Record<string, string> = {};
        settingsRes.data.forEach(s => map[s.key] = s.value);
        setSettings(map);
        if (map.epassport_page_title) setTitle(map.epassport_page_title);
        if (map.epassport_page_subtitle) setSubtitle(map.epassport_page_subtitle);
        if (map.epassport_req_title) setReqTitle(map.epassport_req_title);
        if (map.epassport_req_subtitle) setReqSubtitle(map.epassport_req_subtitle);

        const wpNum = map.passport_whatsapp || map.contact_whatsapp || "966598327617";
        const cleanNum = wpNum.replace(/\D/g, "");
        setWhatsappLink(`https://wa.me/${cleanNum}?text=Hello!%20I%20want%20to%20apply%20for%20an%20E-Passport.`);
      }

      if (reqsRes.data && reqsRes.data.length > 0) {
        setRequirements(reqsRes.data);
      } else {
        // Fallback
        setRequirements([
          { id: "1", title: "জাতীয় পরিচয়পত্র (NID)", desc_text: "আপনার বৈধ জাতীয় পরিচয়পত্রের একটি স্পষ্ট ফটোকপি অথবা অনলাইন যাচাইকৃত জন্ম নিবন্ধন সনদ।", icon_name: "UserCheck", color: "blue", order_num: 1 },
          { id: "2", title: "পূর্ববর্তী পাসপোর্ট", desc_text: "আপনার বিদ্যমান/পুরাতন পাসপোর্টের তথ্য পাতার কপি (যদি নবায়ন বা আপগ্রেডের জন্য আবেদন করেন)।", icon_name: "FileText", color: "emerald", order_num: 2 },
          { id: "3", title: "পেশার প্রমাণপত্র", desc_text: "ইকামা/ভিসার কপি (প্রবাসীদের জন্য), এমপ্লয়ি আইডি কার্ড, অথবা আপনার উল্লেখিত পেশার স্বপক্ষে প্রমাণপত্র।", icon_name: "UploadCloud", color: "rose", order_num: 3 },
          { id: "4", title: "আবেদনপত্র (Form)", desc_text: "পূরণকৃত এবং প্রিন্ট করা ই-পাসপোর্ট আবেদন সামারি। এটি সঠিকভাবে পূরণ করতে আমরা আপনাকে সাহায্য করব।", icon_name: "CheckCircle2", color: "purple", order_num: 4 },
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
          <span className="text-rose-400">{title}</span>
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
          src={settings.passport_cover_image_url || "/epassport_cover.png"}
          alt="E-Passport Services"
          className="w-full h-full object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-200 font-bold text-[10px] uppercase tracking-widest mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>প্রিমিয়াম সার্ভিস</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-display tracking-tight drop-shadow-lg">
            {title.split(' ').map((word, i) => (
              <React.Fragment key={i}>
                {word} {i === 0 && <br className="md:hidden" />}
              </React.Fragment>
            ))}
          </h1>
          <p className="mt-4 text-slate-300 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Main Content - Requirements */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">

          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight">
              {reqTitle}
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              {reqSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {requirements.map((req) => {
              const IconComponent = IconMap[req.icon_name] || CheckCircle2;
              return (
                <div key={req.id} className={`flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-${req.color}-200 hover:bg-${req.color}-50/50 transition-colors group`}>
                  <div className={`w-12 h-12 rounded-full bg-${req.color}-100 text-${req.color}-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 mb-1 text-base">{req.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {req.desc_text}
                    </p>
                  </div>
                </div>
              );
            })}
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
              {settings.passport_contact_title || "Live Query Desk"}
            </h2>
            <p className="text-xs text-slate-500 mb-8 max-w-lg mx-auto">
              {settings.passport_contact_subtitle || "Get in touch with our experts. We're ready to answer your questions and provide personalized consultation."}
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
                      {settings.passport_contact_phone || settings.contact_phone || "+966 50 111 2222"}
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
                      {settings.passport_contact_email || settings.contact_email || "info@alnazimtravels.com"}
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
                      {settings.passport_contact_address || settings.contact_address || "Jeddah, Saudi Arabia"}
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
                  href={getEPassportQueryWhatsapp()}
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
                    <option value="E-Passport Application">E-Passport Application</option>
                    <option value="Visa Application">Visa Application</option>
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

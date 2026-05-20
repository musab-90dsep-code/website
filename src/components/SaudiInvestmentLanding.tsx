import { useState, FormEvent, ReactNode } from "react";
import { UserCheck, Rocket, DollarSign, Award, Snowflake, PenTool, PhoneCall, Sparkles, Building2, Mail, MapPin } from "lucide-react";

export default function SaudiInvestmentLanding({
  onCallForVisit,
  onNavigateToHubSection,
  children,
}: {
  onCallForVisit?: () => void;
  onNavigateToHubSection?: (tab: string) => void;
  children?: ReactNode;
}) {
  const [quoteRequestStatus, setQuoteRequestStatus] = useState<"none" | "submitting" | "done">("none");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteName, setQuoteName] = useState("");
  const [quotePhone, setQuotePhone] = useState("");
  const [quoteSelection, setQuoteSelection] = useState("Aircon Servicing");

  const triggerQuote = (e: FormEvent) => {
    e.preventDefault();
    setQuoteRequestStatus("submitting");
    setTimeout(() => {
      setQuoteRequestStatus("done");
    }, 1200);
  };

  return (
    <div className="font-sans text-slate-900 antialiased bg-slate-50 min-h-screen">
      {/* 1. TOP BRANDING NAVIGATION (Vibrant Palette Theme styling) */}
      <nav id="top-navigation" className="h-[64px] bg-slate-900/90 border-b border-white/10 px-4 md:px-12 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Encore-inspired vibrant visual badge */}
          <div className="w-8 h-8 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-rose-500/30 italic text-xl">S</div>
          <span className="font-display font-black text-sm md:text-base tracking-tight text-white">
            SAUDI INVESTMENT
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
          <a href="#homepage" className="text-rose-400 border-b-2 border-rose-400 pb-0.5">Home</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#category-hub" className="hover:text-white transition-colors">Service</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>

        {/* Right Action Quote Button */}
        <button
          onClick={() => setShowQuoteModal(true)}
          className="bg-rose-500 text-white px-5 py-2 rounded-full hover:bg-rose-600 transition-all font-display font-semibold text-xs shadow-lg shadow-rose-500/20 hover:scale-102"
        >
          Get Quote
        </button>
      </nav>

      {/* 2. MAIN HERO SECTION (Vibrant Palette signature layout) */}
      <section id="homepage" className="relative min-h-[600px] text-white py-20 px-4 md:px-12 flex flex-col justify-center overflow-hidden">
        {/* Full-cover hero image — clear and bright */}
        <div className="absolute inset-0 z-0">
          <img
            src="/image.png"
            alt="Hero image"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle dark gradient only at bottom so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </div>

        {/* Vibrant Floating CSS Bar/Block charts */}
        <div className="absolute left-6 md:left-20 bottom-10 hidden lg:block w-72 h-44 z-10 pointer-events-none">
          <div className="relative w-full h-full flex items-end gap-3">
            <div className="w-8 bg-gradient-to-t from-rose-600 to-rose-400 rounded h-[110px] shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-pulse" />
            <div className="w-8 bg-gradient-to-t from-orange-600 to-orange-400 rounded h-[140px] shadow-[0_0_20px_rgba(249,115,22,0.4)]" />
            <div className="w-8 bg-gradient-to-t from-teal-600 to-teal-400 rounded h-[90px] shadow-[0_0_10px_rgba(20,184,166,0.4)]" />
            <div className="w-8 bg-gradient-to-t from-indigo-700 to-indigo-500 rounded h-[130px]" />
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-4xl mx-auto text-center relative z-20 space-y-6">

          <h1 className="text-4xl md:text-7xl font-black text-white leading-none text-center tracking-tighter font-display uppercase drop-shadow-lg">
            BEYOND THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
              ORDINARY.
            </span>
          </h1>

          <p className="text-white/80 text-sm md:text-xl text-center max-w-2xl mx-auto leading-relaxed drop-shadow">
            We provide professional air-conditioning and interior design services across Saudi Arabia, engineering spaces that linger long after the work is done.
          </p>

          <div className="pt-4 flex justify-center">
            <a
              href="#contact"
              className="bg-rose-500 hover:bg-rose-600 text-white font-display text-xs font-bold py-3.5 px-8 rounded-full shadow-lg shadow-rose-500/30 transition-all hover:scale-105 inline-flex items-center gap-2 no-underline cursor-pointer"
            >
              <PhoneCall className="h-4 w-4" />
              Call for Visit
            </a>
          </div>
        </div>
      </section>

      {children}



      {/* 4. WHY CHOOSE US (Grounded in Vibrant Palette 4-accent layout: rose, orange, teal, indigo) */}
      <section className="py-16 bg-slate-50 border-t border-b border-slate-200 px-4 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight uppercase">Why Choose Us</h2>
            <p className="text-xs text-slate-500 font-mono mt-1">Providing excellence in aircon & interior systems</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 - Rose theme */}
            <div className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-rose-400 hover:bg-rose-50/40 transition-all shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center text-rose-600">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold font-display text-base text-slate-950 leading-snug">
                  Experienced and Certified Technicians
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Our skilled team is trained and certified to handle all aircon and interior works with precision, ensuring reliable service and long-lasting performance for every project.
                </p>
              </div>
            </div>

            {/* Card 2 - Orange theme */}
            <div className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-orange-400 hover:bg-orange-50/40 transition-all shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600">
                  <Rocket className="h-5 w-5" />
                </div>
                <h3 className="font-bold font-display text-base text-slate-950 leading-snug">
                  Fast Response & Same-Day Service
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  We understand urgency. Our technicians are always ready to respond quickly, offering same-day service to restore comfort and convenience without unnecessary delays.
                </p>
              </div>
            </div>

            {/* Card 3 - Teal theme */}
            <div className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-teal-400 hover:bg-teal-50/40 transition-all shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="font-bold font-display text-base text-slate-950 leading-snug">
                  Affordable & Transparent Pricing
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  No hidden costs or surprise charges — just fair, upfront pricing for all our aircon and interior services, giving you peace of mind and excellent value.
                </p>
              </div>
            </div>

            {/* Card 4 - Indigo theme */}
            <div className="group bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all shadow-xs flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-bold font-display text-base text-slate-950 leading-snug">
                  Quality Workmanship Guaranteed
                </h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  We take pride in every job. Our work is backed by professional standards, attention to detail, and guaranteed satisfaction for lasting results you can trust.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* 5. CONTACT SECTION */}
      <section id="contact" className="py-16 bg-white px-4 md:px-12">
        <div className="max-w-4xl mx-auto bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 text-center">
          <h2 className="text-3xl font-black text-slate-900 font-display tracking-tight uppercase mb-2">Live Query Desk</h2>
          <p className="text-sm text-slate-500 mb-8 max-w-lg mx-auto">
            Get in touch with our experts. We're ready to answer your questions and provide personalized consultation.
          </p>

          <div className="flex flex-col md:flex-row gap-8 justify-center max-w-2xl mx-auto text-left">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Hotline</div>
                  <div className="font-bold text-slate-800">+966 50 111 2222</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Support</div>
                  <div className="font-bold text-slate-800">info@saudiinvestment.com</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Headquarters</div>
                  <div className="font-bold text-slate-800">Riyadh, Saudi Arabia</div>
                </div>
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <input type="text" placeholder="Your Name" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500" />
              <input type="tel" placeholder="Phone Number" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500" />
              <button className="w-full bg-rose-500 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg shadow-md hover:bg-rose-600 transition-colors">
                Request Callback
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GET QUOTE MODAL */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-base text-slate-900 font-display">Get Fast Quote</h4>
                <p className="text-xs text-slate-500">Response within 15 minutes guaranteed</p>
              </div>
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  setQuoteRequestStatus("none");
                }}
                className="text-slate-400 hover:text-slate-700 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {quoteRequestStatus !== "done" ? (
              <form onSubmit={triggerQuote} className="space-y-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={quoteName}
                    onChange={(e) => setQuoteName(e.target.value)}
                    placeholder="e.g. Fahad Al-Saeed"
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono mb-1">Saudi Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="e.g. +966 50 111 2222"
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono mb-1">Requested Solution</label>
                  <select
                    value={quoteSelection}
                    onChange={(e) => setQuoteSelection(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-rose-500"
                  >
                    <option>Aircon Servicing (Routine)</option>
                    <option>Chemical Washing (Restore Cooling)</option>
                    <option>Central AC Installation</option>
                    <option>Interior Spatial Consultation</option>
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={quoteRequestStatus === "submitting"}
                  className="w-full py-2 bg-rose-500 text-white text-xs font-semibold rounded-full hover:bg-rose-600 transition-all font-display uppercase tracking-widest"
                >
                  {quoteRequestStatus === "submitting" ? "Requesting..." : "SUBMIT REQUEST"}
                </button>
              </form>
            ) : (
              <div className="text-center py-4 space-y-2">
                <Award className="h-10 w-10 text-emerald-500 mx-auto animate-bounce" />
                <h5 className="font-bold text-sm text-slate-900 font-display">Quote Locked Successfully</h5>
                <p className="text-xs text-slate-600 leading-normal">
                  Thank you, <span className="font-bold">{quoteName}</span>. Your VIP consultation reference ticket was created. One of our engineers will ring you back immediately.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteRequestStatus("none");
                  }}
                  className="px-5 py-1.5 bg-slate-100 text-xs font-bold text-slate-600 rounded-full hover:bg-slate-200 mt-2 font-mono"
                >
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

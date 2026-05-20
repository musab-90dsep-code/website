import { ArrowLeft, FileText, Plane, MapPin, CheckCircle2 } from "lucide-react";

export default function VisaApplicationPage({ onBack }: { onBack: () => void }) {
  const countries = [
    {
      name: "সৌদি আরব",
      type: "কাজের, উমরাহ এবং ভিজিট ভিসা",
      desc: "আমাদের মাধ্যমে দ্রুত এবং বিশ্বস্ততার সাথে আপনার সৌদি ভিসা প্রসেস করুন। উমরাহ, বিজনেস এবং কাজের ভিসার জন্য সম্পূর্ণ গাইডলাইন ও সহায়তা প্রদান করা হয়।",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600"
    },
    {
      name: "সংযুক্ত আরব আমিরাত (ইউএই)",
      type: "ট্যুরিস্ট এবং বিজনেস ভিসা",
      desc: "দুবাই এবং সংযুক্ত আরব আমিরাতের ভিসা প্রসেসিং দ্রুততম সময়ে করুন। ট্যুরিস্ট, ট্রানজিট এবং বিজনেস ভ্রমণকারীদের জন্য আদর্শ সার্ভিস।",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      name: "কাতার",
      type: "ভিজিট এবং কাজের ভিসা",
      desc: "ঝামেলামুক্ত কাতার ভিসা প্রসেসিং সেবা, যার মধ্যে প্রয়োজনীয় কাগজপত্র সত্যায়ন এবং যথাযথ আবেদন সাবমিশন অন্তর্ভুক্ত রয়েছে।",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      name: "ওমান",
      type: "চাকরি এবং ভিজিট ভিসা",
      desc: "ওমান ভিসার আবেদনের জন্য নিখুঁত প্রফেশনাল সাপোর্ট। আপনার সব প্রয়োজনীয় ডকুমেন্ট সঠিক সময়ে প্রস্তুত করার নিশ্চয়তা।",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600"
    },
    {
      name: "ইউরোপ (সেনজেন)",
      type: "ট্যুরিস্ট এবং স্টুডেন্ট ভিসা",
      desc: "ইউরোপ সেনজেন ভিসার জন্য সম্পূর্ণ প্রফেশনাল গাইডলাইন। ভ্রমণ পরিকল্পনা সাজানো, ট্রাভেল ইন্সুরেন্স এবং ফাইল প্রিপারেশনে সাহায্য করা হবে।",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      name: "মালয়েশিয়া",
      type: "ট্যুরিস্ট এবং মেডিকেল ভিসা",
      desc: "সর্বনিম্ন কাগজপত্রের মাধ্যমে খুব সহজেই মালয়েশিয়ান ই-ভিসা এবং স্টিকার ভিসা প্রসেসিংয়ের নির্ভরযোগ্য সেবা।",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    }
  ];

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
          <span className="text-orange-400">ভিসা আবেদন</span>
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
          src="/epassport_cover.png" 
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
            ভিসা আবেদন
          </h1>
          <p className="mt-4 text-slate-300 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            আমরা বিশ্বের বিভিন্ন দেশের ভিসা প্রসেসিং করে থাকি। আপনার প্রয়োজনীয় দেশের ভিসা নির্বাচন করুন এবং ঝামেলামুক্ত সেবা উপভোগ করুন।
          </p>
        </div>
      </div>

      {/* Main Content - Countries */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight">
              আমাদের ভিসা গন্তব্যসমূহ
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              নিচে উল্লেখিত দেশগুলোর জন্য আমরা অত্যন্ত বিশ্বস্ততার সাথে ভিসা প্রসেসিং করে থাকি।
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {countries.map((country, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all group relative overflow-hidden">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${country.iconBg} ${country.iconColor} group-hover:scale-110 transition-transform`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{country.name}</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                  {country.type}
                </div>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {country.desc}
                </p>
                <div className="mt-6 flex items-center gap-2 text-rose-500 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  বিস্তারিত জানুন <ArrowLeft className="w-4 h-4 rotate-180" />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">অন্য কোনো দেশের ভিসা প্রয়োজন?</h3>
              <p className="text-sm text-slate-500">আমাদের সাথে যোগাযোগ করুন, আমরা আপনাকে সাহায্য করতে প্রস্তুত।</p>
            </div>
            <button className="bg-slate-900 text-white px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors font-bold text-sm shadow-lg whitespace-nowrap">
              যোগাযোগ করুন
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}

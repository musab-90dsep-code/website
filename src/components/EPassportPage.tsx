import { ArrowLeft, CheckCircle2, FileText, UploadCloud, CreditCard, UserCheck } from "lucide-react";

export default function EPassportPage({ onBack }: { onBack: () => void }) {
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
          <span className="text-rose-400">ই-পাসপোর্ট আবেদন</span>
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
        {/* Placeholder for Cover Photo - using a gradient/image blend */}
        <img 
          src="/epassport_cover.png" 
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
            ই-পাসপোর্ট <br className="md:hidden" /> আবেদন
          </h1>
          <p className="mt-4 text-slate-300 font-medium max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            দ্রুত, নির্ভরযোগ্য এবং ঝামেলামুক্ত ই-পাসপোর্ট প্রসেসিং। আপনার আবেদন যাতে কোনো বিলম্ব ছাড়া অনুমোদিত হয়, সে জন্য আমরা প্রতিটি ধাপে আপনাকে সাহায্য করব।
          </p>
        </div>
      </div>

      {/* Main Content - Requirements */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display tracking-tight">
              আবেদনের জন্য যা যা লাগবে
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              আপনার ই-পাসপোর্ট আবেদন শুরু করার আগে অনুগ্রহ করে নিচের কাগজপত্রগুলো সংগ্রহ করুন।
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Requirement 1 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-base">জাতীয় পরিচয়পত্র (NID)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  আপনার বৈধ জাতীয় পরিচয়পত্রের একটি স্পষ্ট ফটোকপি অথবা অনলাইন যাচাইকৃত জন্ম নিবন্ধন সনদ।
                </p>
              </div>
            </div>

            {/* Requirement 2 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-base">পূর্ববর্তী পাসপোর্ট</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  আপনার বিদ্যমান/পুরাতন পাসপোর্টের তথ্য পাতার কপি (যদি নবায়ন বা আপগ্রেডের জন্য আবেদন করেন)।
                </p>
              </div>
            </div>

            {/* Requirement 3 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-base">পেশার প্রমাণপত্র</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  ইকামা/ভিসার কপি (প্রবাসীদের জন্য), এমপ্লয়ি আইডি কার্ড, অথবা আপনার উল্লেখিত পেশার স্বপক্ষে প্রমাণপত্র।
                </p>
              </div>
            </div>

            {/* Requirement 4 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1 text-base">আবেদনপত্র (Form)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  পূরণকৃত এবং প্রিন্ট করা ই-পাসপোর্ট আবেদন সামারি। এটি সঠিকভাবে পূরণ করতে আমরা আপনাকে সাহায্য করব।
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="bg-rose-500 text-white px-8 py-4 rounded-xl hover:bg-rose-600 transition-all font-display font-black text-sm tracking-widest shadow-xl shadow-rose-500/30 hover:scale-105 inline-flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              এখনই আবেদন করুন
            </button>
            <p className="mt-4 text-xs text-slate-400 font-mono">কোনো সাহায্য প্রয়োজন? আমাদের সাপোর্ট টিমের সাথে হোয়াটসঅ্যাপে যোগাযোগ করুন।</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

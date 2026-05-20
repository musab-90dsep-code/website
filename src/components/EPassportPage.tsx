import { ArrowLeft, CheckCircle2, FileText, UploadCloud, CreditCard, UserCheck } from "lucide-react";

export default function EPassportPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="font-sans text-slate-900 antialiased bg-slate-50 min-h-screen pb-20">
      {/* Navigation Bar */}
      <nav className="h-[64px] bg-slate-900/90 border-b border-white/10 px-4 md:px-12 flex items-center sticky top-0 z-40 backdrop-blur-md">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-semibold text-sm"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
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
            <span>Premium Service</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-display tracking-tight uppercase drop-shadow-lg">
            E-Passport <br className="md:hidden" /> Application
          </h1>
          <p className="mt-4 text-slate-300 font-medium max-w-xl mx-auto text-sm md:text-base">
            Fast, reliable, and hassle-free E-Passport processing. We guide you through every step to ensure your application is approved without delays.
          </p>
        </div>
      </div>

      {/* Main Content - Requirements */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
          
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 font-display uppercase tracking-tight">
              What You Need to Apply
            </h2>
            <p className="text-slate-500 mt-2 text-sm md:text-base">
              Please gather the following documents before starting your E-Passport application.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Requirement 1 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">National ID (NID)</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  A clear photocopy of your valid National Identity Card or online verified Birth Registration Certificate.
                </p>
              </div>
            </div>

            {/* Requirement 2 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Previous Passport</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Copy of your existing/old passport's information page (if applying for renewal or upgrade).
                </p>
              </div>
            </div>

            {/* Requirement 3 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-rose-200 hover:bg-rose-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Proof of Profession</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Copy of Iqama/Visa (for expats), employee ID card, or relevant documents supporting your listed profession.
                </p>
              </div>
            </div>

            {/* Requirement 4 */}
            <div className="flex gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/50 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Application Form</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Completed and printed E-Passport application summary. We will help you fill this out correctly.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button className="bg-rose-500 text-white px-8 py-4 rounded-xl hover:bg-rose-600 transition-all font-display font-black text-sm uppercase tracking-widest shadow-xl shadow-rose-500/30 hover:scale-105 inline-flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Apply Now
            </button>
            <p className="mt-4 text-xs text-slate-400 font-mono">Need help? Contact our support team via WhatsApp.</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

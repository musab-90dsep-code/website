import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SERVICES } from "../data";
import { ServiceItem } from "../types";
import { Check, CheckCircle } from "lucide-react";

export default function ServicesHub({ preferredServiceId }: { preferredServiceId?: string }) {
  const [bookingStep, setBookingStep] = useState<"list" | "form" | "success">("list");
  const [selectedService, setSelectedService] = useState<ServiceItem>(SERVICES[0]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [unitsCount, setUnitsCount] = useState(1);

  const startBooking = (svc: ServiceItem) => {
    setSelectedService(svc);
    setBookingStep("form");
  };

  const calculateAirconSum = () => {
    if (selectedService.id === "interior-consult") return 0;
    if (selectedService.id === "installation-rep") return "Custom Estimate";
    const base = selectedService.id === "general-srv" ? 150 : 350;
    return base * unitsCount;
  };

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    setBookingStep("success");
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-600 font-mono uppercase tracking-widest border border-indigo-500/20">
          Authorized Service Station
        </span>
        <h3 className="text-3xl font-black text-slate-900 mt-3 font-display uppercase tracking-tight">
          Mechanical & Spatial Services
        </h3>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto font-sans">
          We maintain rigorous engineering standards across air-conditioning systems and luxury interior designs. Select your service with upfront prices below.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {bookingStep === "list" && (
          <motion.div
            key="services-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            {SERVICES.map((svc) => (
              <div
                key={svc.id}
                className="bg-white p-6 rounded-2xl border-2 border-slate-150/80 shadow-xs flex flex-col justify-between hover:border-indigo-400 hover:bg-indigo-50/20 hover:shadow-md transition-all duration-300 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-extrabold text-base text-slate-900 font-display group-hover:text-indigo-600 transition-colors uppercase tracking-wide">
                      {svc.title}
                    </h4>
                    <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 flex-none">
                      {svc.price}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {svc.description}
                  </p>
                  
                  {/* Service attributes list */}
                  <div className="py-3 space-y-1.5 text-xs text-slate-500 font-sans border-t border-dashed border-slate-100 mt-2">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500 flex-none" />
                      <span>{svc.id.includes("interior") ? "High-res 3D space render layout" : "Certified aircon mechanical expert"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500 flex-none" />
                      <span>{svc.id.includes("interior") ? "Premium material index matrix" : "100% full replacement guarantee"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 gap-3">
                  <span className="text-[10px] font-mono font-bold text-slate-400">
                    Duration: {svc.duration}
                  </span>
                  <button
                    onClick={() => startBooking(svc)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all text-xs font-bold uppercase tracking-wider font-display cursor-pointer shadow-lg shadow-indigo-600/10"
                  >
                    BOOK NOW
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {bookingStep === "form" && (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-xl mx-auto bg-white p-8 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="mb-6 pb-4 border-b border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-widest">You are booking</span>
                <h4 className="font-extrabold text-base text-indigo-600 font-display uppercase tracking-wide mt-0.5">{selectedService.title}</h4>
              </div>
              <button
                onClick={() => setBookingStep("list")}
                className="text-xs text-slate-400 hover:text-slate-700 font-mono font-bold cursor-pointer transition-colors"
              >
                ← BACK
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono uppercase mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Sultan Ahmed"
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-indigo-500 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. sultan@domain.sa"
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 font-mono uppercase mb-1">Service Area & Street Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Olaya District, Riyadh, Saudi Arabia"
                  className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono uppercase mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 font-mono uppercase mb-1">Time Slot</label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full text-xs border border-slate-200 bg-white rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                  >
                    <option value="09:00">09:00 AM - 11:00 AM</option>
                    <option value="11:30">11:30 AM - 01:30 PM</option>
                    <option value="14:00">02:00 PM - 04:00 PM</option>
                    <option value="16:30">04:30 PM - 06:30 PM</option>
                  </select>
                </div>
                {selectedService.id !== "interior-consult" && selectedService.id !== "installation-rep" ? (
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 font-mono uppercase mb-1">AC Units Count</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={unitsCount}
                      onChange={(e) => setUnitsCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col justify-end">
                    <span className="text-[10px] text-slate-400 font-mono leading-tight italic font-sans mb-1">
                      *Special site inspection included
                    </span>
                  </div>
                )}
              </div>

              {/* pricing preview */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center mt-4">
                <span className="text-xs font-bold text-slate-500 uppercase font-mono">Estimated Amount:</span>
                <span className="text-lg font-black text-indigo-700 font-display">
                  {typeof calculateAirconSum() === "number" ? `SAR ${calculateAirconSum()}` : calculateAirconSum()}
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-full font-bold text-xs transition-all tracking-wider uppercase font-display shadow-lg shadow-indigo-600/20 cursor-pointer"
              >
                PROCEED TO LOCK IN DISPATCH
              </button>
            </form>
          </motion.div>
        )}

        {bookingStep === "success" && (
          <motion.div
            key="booking-success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-slate-200 space-y-4 shadow-sm"
          >
            <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
            <h4 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">Appointment Dispatched!</h4>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Dear <span className="font-bold text-slate-900">{userName}</span>, we have reserved your dispatch calendar for <span className="font-bold text-indigo-600 font-sans">{date} @ {time}</span>. A certified engineer from Saudi Investment division will ring you shortly.
            </p>
            <div className="pt-2">
              <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                OFFICIAL BOOKING CODE: #{Math.floor(Math.random() * 899999) + 100000}
              </span>
            </div>
            <button
              onClick={() => {
                setBookingStep("list");
                setUnitsCount(1);
              }}
              className="px-6 py-2 border-2 border-slate-200 hover:border-indigo-600 text-xs font-bold text-slate-700 font-mono transition-colors mt-4 cursor-pointer rounded-full"
            >
              BOOK ANOTHER SERVICE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

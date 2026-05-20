import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HAPPY_CLIENTS } from "../data";
import { ClientReview } from "../types";
import { Star, Quote, ShieldCheck, MapPin, Plus, Sparkles } from "lucide-react";

export default function HappyClientsHub() {
  const [activeClient, setActiveClient] = useState<ClientReview>(HAPPY_CLIENTS[0]);
  const [reviewsList, setReviewsList] = useState<ClientReview[]>(HAPPY_CLIENTS);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("Riyadh");
  const [newReviewText, setNewReviewText] = useState("");
  const [newService, setNewService] = useState("General Servicing");

  const addNewReview = (e: FormEvent) => {
    e.preventDefault();
    if (!newName || !newReviewText) return;

    const newReview: ClientReview = {
      id: `custom-client-${Date.now()}`,
      name: newName,
      location: newCity,
      avatarLetter: newName.charAt(0).toUpperCase(),
      colorClass: "bg-teal-500 ring-2 ring-teal-200",
      rating: 5,
      reviewText: newReviewText,
      serviceReceived: newService,
    };

    const updatedList = [...reviewsList, newReview];
    setReviewsList(updatedList);
    setActiveClient(newReview);
    
    setNewName("");
    setNewReviewText("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full text-xs font-black bg-teal-500/10 text-teal-600 font-mono uppercase tracking-widest border border-teal-500/20">
          User Satisfaction Engine
        </span>
        <h3 className="text-3xl font-black text-slate-900 mt-3 font-display uppercase tracking-tight">
          Happy Clients & Testimonials
        </h3>
        <p className="text-sm text-teal-600 mt-1 font-mono uppercase tracking-widest font-black">
          Our Happy Clients
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Spotlight Showcase of selected client */}
        <div className="relative bg-white border border-slate-100 p-8 rounded-2xl shadow-xs min-h-[225px] flex flex-col justify-between overflow-hidden">
          {/* Decorative Quote Icon Background */}
          <div className="absolute right-4 top-4 text-slate-100 pointer-events-none">
            <Quote className="h-28 w-28 stroke-[1px] opacity-25" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeClient.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              className="space-y-4 relative z-10"
            >
              {/* Rating and Service Tag */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(activeClient.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-teal-5050 fill-teal-400 text-teal-500" />
                  ))}
                </div>
                <span className="text-[11px] font-mono bg-teal-50 text-teal-700 px-3 py-1 rounded-full font-bold border border-teal-100">
                  {activeClient.serviceReceived}
                </span>
              </div>

              {/* Review Text */}
              <blockquote className="text-sm md:text-base text-slate-700 italic font-semibold leading-relaxed">
                &ldquo;{activeClient.reviewText}&rdquo;
              </blockquote>

              {/* Client Bio */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white font-bold font-display shadow-sm text-sm">
                  {activeClient.avatarLetter}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm md:text-base font-display flex items-center gap-1.5 uppercase tracking-wide">
                    {activeClient.name}
                    <ShieldCheck className="h-4 w-4 text-teal-500 fill-teal-50" />
                  </div>
                  <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-teal-500" />
                    <span>Verified Client • {activeClient.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 8 Selector Nodes in Teal palette */}
        <div className="flex flex-col items-center gap-2 mt-8">
          <div className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-widest">
            Select Node To View Testimonial
          </div>
          
          <div className="flex justify-center flex-wrap gap-2.5 max-w-lg mt-1 select-none">
            {reviewsList.map((client, index) => {
              const isActive = activeClient.id === client.id;
              return (
                <button
                  key={client.id}
                  onClick={() => setActiveClient(client)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-teal-500 text-white w-9 h-9 scale-110 ring-4 ring-teal-100 shadow-md"
                      : "bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100"
                  }`}
                  title={client.name}
                >
                  <span className="text-xs font-mono font-bold leading-none">
                    {index + 1}
                  </span>

                  {isActive && (
                    <span className="absolute -inset-1 rounded-full border-2 border-teal-400 animate-ping opacity-30 pointer-events-none" />
                  )}
                </button>
              );
            })}

            {/* Plus button to add custom review */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-all border border-slate-300 cursor-pointer"
              title="Add Your Verified Review"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Dynamic Add Review Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-6"
            >
              <form onSubmit={addNewReview} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
                <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5 font-display uppercase tracking-wide">
                  <Sparkles className="h-4 w-4 text-teal-500 animate-pulse" />
                  Write Your Aircon & Service Review
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Faisal Al-Shammari"
                      className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-teal-500 font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1">
                      City Location
                    </label>
                    <select
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full text-xs border border-slate-300 bg-white rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-teal-500 font-mono"
                    >
                      <option value="Riyadh">Riyadh</option>
                      <option value="Jeddah">Jeddah</option>
                      <option value="Dammam">Dammam</option>
                      <option value="Al Khobar">Al Khobar</option>
                      <option value="Medina">Medina</option>
                      <option value="Mecca">Mecca</option>
                      <option value="Tabuk">Tabuk</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1">
                      Service Selected
                    </label>
                    <select
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      className="w-full text-xs border border-slate-200 bg-white rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-teal-500 font-sans"
                    >
                      <option value="General Aircon Servicing">General Aircon Servicing</option>
                      <option value="Aircon Chemical Wash">Aircon Chemical Wash</option>
                      <option value="Aircon Emergency Repair">Aircon Emergency Repair</option>
                      <option value="Interior spatial consultation">Interior Spatial Consultation</option>
                      <option value="Bespoke luxury remodeling">Bespoke Luxury Remodeling</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <span className="text-[10px] text-slate-400 font-mono leading-tight">
                      *Note: Submitted reviews will dynamically register as a selectable node button above.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-500 font-mono uppercase mb-1">
                    Your Testimonial Review text
                  </label>
                  <textarea
                    required
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    rows={3}
                    placeholder="Describe your satisfaction with the technicians, response time, or custom design layouts..."
                    className="w-full text-xs border border-slate-200 rounded-lg px-2.5 py-2.5 focus:outline-none focus:border-teal-500 font-sans"
                  />
                </div>

                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border border-slate-250 rounded-full text-xs text-slate-500 hover:bg-slate-50 font-mono cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer shadow-lg shadow-teal-500/10"
                  >
                    SUBMIT VERIFIED NODE
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

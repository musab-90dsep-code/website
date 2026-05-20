import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CONCERTS } from "../data";
import { ConcertItem } from "../types";
import { Music, MapPin, Calendar, Clock, Ticket, User, Sparkles, CheckCircle } from "lucide-react";

export default function ConcertHub() {
  const [selectedConcert, setSelectedConcert] = useState<ConcertItem>(CONCERTS[0]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [discountMessage, setDiscountMessage] = useState("");

  const rows = ["A", "B", "C", "D"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8];

  const preBooked = ["A3", "A4", "B6", "C2", "D4", "D5"];

  const toggleSeat = (seatId: string) => {
    if (preBooked.includes(seatId)) return;
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatColor = (seatId: string) => {
    if (preBooked.includes(seatId)) return "bg-rose-200 text-rose-500 cursor-not-allowed opacity-40";
    if (selectedSeats.includes(seatId)) return "bg-orange-500 ring-2 ring-orange-300 ring-offset-2 text-white";
    
    if (seatId.startsWith("A")) return "bg-orange-50 hover:bg-orange-100/80 text-orange-900 border-orange-200 border";
    if (seatId.startsWith("B")) return "bg-amber-50 hover:bg-amber-100/80 text-amber-900 border-amber-200 border";
    return "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 border";
  };

  const calculateTotal = () => {
    let seatPrice = selectedConcert.price === "Sponsored (Free Entries via Spin)" ? 0 : 250;
    
    let total = selectedSeats.reduce((acc, seat) => {
      let multiplier = 1.0;
      if (seat.startsWith("A")) multiplier = 1.5; 
      if (seat.startsWith("B")) multiplier = 1.25; 
      return acc + seatPrice * multiplier;
    }, 0);

    if (couponCode.toLowerCase().trim().includes("coupon") || couponCode.toLowerCase().trim().includes("spin") || couponCode.toLowerCase().trim().includes("free")) {
      return 0; 
    }
    return Math.floor(total);
  };

  const handleBookingSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!userName || !userPhone || selectedSeats.length === 0) return;
    setIsBooked(true);
  };

  const applyPromo = () => {
    if (couponCode.trim()) {
      setDiscountMessage("Sponsor Coupon Applied: 100% Complimentary Admission!");
    }
  };

  return (
    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
      <div className="max-w-2xl mx-auto text-center mb-10">
        <span className="inline-flex items-center gap-1.5 px-4.5 py-1.5 rounded-full text-xs font-black bg-orange-500/10 text-orange-600 font-mono uppercase tracking-widest border border-orange-500/20">
          Sponsorship & Concert Tickets
        </span>
        <h3 className="text-3xl font-black text-slate-900 mt-3 font-display uppercase tracking-tight">
          Cultural & Classical Concerts
        </h3>
        <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto font-sans">
          As part of the Saudi Vision 2030 cultural programs, Saudi Investment sponsors international classical events. Secure your sponsored bookings below.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Concert Selection */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="text-xs font-semibold uppercase font-mono text-slate-400 tracking-wider">
            Select Active Event
          </div>
          {CONCERTS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedConcert(c);
                setSelectedSeats([]);
                setIsBooked(false);
              }}
              className={`p-5 rounded-2xl text-left border-2 transition-all duration-300 flex flex-col gap-2 relative overflow-hidden cursor-pointer ${
                selectedConcert.id === c.id
                  ? "bg-slate-900 border-slate-900 text-white shadow-lg -translate-y-0.5"
                  : "bg-white border-slate-100 text-slate-800 hover:border-orange-300"
              }`}
            >
              <div className="flex justify-between items-start gap-2 w-full">
                <span className={`text-[9px] font-mono font-bold tracking-widest uppercase px-2 py-0.5 rounded-md ${
                  selectedConcert.id === c.id ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-700"
                }`}>
                  {c.id === "concert-1" ? "SPONSORED" : "LIMITED"}
                </span>
                <span className="text-xs font-mono font-semibold opacity-75">
                  {c.availableTickets} tickets left
                </span>
              </div>
              <h5 className="font-extrabold text-sm leading-snug font-display mt-1">
                {c.title}
              </h5>
              <div className="flex items-center gap-1 text-xs opacity-80 font-mono mt-1">
                <Calendar className="h-3.5 w-3.5 inline-block text-orange-400" />
                <span>{c.date}</span>
              </div>
              <div className="flex items-center gap-1 text-xs opacity-80 font-mono">
                <MapPin className="h-3.5 w-3.5 inline-block text-orange-400" />
                <span className="truncate">{c.venue.split(",")[0]}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column: Seating Visualizer & Form */}
        <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-xs">
          <AnimatePresence mode="wait">
            {!isBooked ? (
              <motion.div
                key="booking-flow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Event Summary Box */}
                <div className="p-4.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-black text-lg text-slate-950 flex items-center gap-2 font-display uppercase">
                    <Music className="h-5 w-5 text-orange-500" />
                    {selectedConcert.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-sans">
                    {selectedConcert.description}
                  </p>
                  <div className="grid sm:grid-cols-3 gap-3.5 mt-4 pt-4 border-t border-slate-200 text-xs font-mono text-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-slate-400" />
                      <span>{selectedConcert.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{selectedConcert.venue.split(",")[1] || "Riyadh"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-orange-600">
                      <Ticket className="h-4 w-4 text-orange-500" />
                      <span>Rate: {selectedConcert.price}</span>
                    </div>
                  </div>
                </div>

                {/* Stage Seating Panel */}
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400 font-mono text-center tracking-widest mb-2">
                    STAGE FRONT
                  </div>
                  <div className="w-full h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 rounded-full shadow-xs mb-8" />

                  {/* SVG/CSS Seat Grid */}
                  <div className="flex flex-col items-center gap-3.5">
                    {rows.map((row) => (
                      <div key={row} className="flex items-center gap-4">
                        <span className="w-4 text-xs font-bold text-slate-400 text-center font-mono">
                          {row}
                        </span>
                        <div className="flex gap-2">
                          {cols.map((col) => {
                            const seatId = `${row}${col}`;
                            return (
                              <button
                                key={seatId}
                                onClick={() => toggleSeat(seatId)}
                                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold flex items-center justify-center transition-all cursor-pointer ${getSeatColor(
                                  seatId
                                )}`}
                                title={`Seat ${seatId}`}
                              >
                                {col}
                              </button>
                            );
                          })}
                        </div>
                        <span className="w-4 text-xs font-bold text-slate-400 text-center font-mono">
                          {row}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Seating Legend */}
                  <div className="flex justify-center flex-wrap gap-4 text-[10px] font-mono text-slate-500 mt-8 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-orange-50 border border-orange-200" />
                      <span>VIP (Row A)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-200" />
                      <span>Gold (Row B)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-200" />
                      <span>Silver (Standard)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-orange-500" />
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-rose-200 animate-pulse" />
                      <span>Unavailable</span>
                    </div>
                  </div>
                </div>

                {/* Booking Input Form */}
                <form onSubmit={handleBookingSubmit} className="space-y-4 pt-6 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 tracking-wider font-mono uppercase mb-1">
                        Attendee Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Sultan Ahmed"
                          className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-sans"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 tracking-wider font-mono uppercase mb-1">
                        Saudi Mobile Number
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          required
                          value={userPhone}
                          onChange={(e) => setUserPhone(e.target.value)}
                          placeholder="e.g. +966 50 123 4567"
                          className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 tracking-wider font-mono uppercase mb-1">
                      Sponsor Coupon Code (Optional - Apply Award won in Wheels)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="e.g. VIP Concert Raffle"
                        className="flex-1 px-3 py-2.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={applyPromo}
                        className="px-4 py-2.5 border-2 border-slate-200 hover:border-orange-500 rounded-lg text-xs font-bold text-slate-700 font-mono transition-colors cursor-pointer"
                      >
                        APPLY
                      </button>
                    </div>
                    {discountMessage && (
                      <p className="text-xs text-emerald-600 mt-1.5 font-bold flex items-center gap-1.5 font-sans">
                        <Sparkles className="h-4 w-4 text-emerald-500 animate-bounce" />
                        {discountMessage}
                      </p>
                    )}
                  </div>

                  {/* Bottom Rate Calculations */}
                  <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-50 p-4 rounded-2xl mt-6 gap-4 border border-slate-100">
                    <div className="text-center sm:text-left">
                      <div className="text-xs text-slate-500 font-mono">
                        Selected: <span className="font-bold text-slate-800">{selectedSeats.join(", ") || "None"}</span>
                      </div>
                      <div className="text-lg font-black text-slate-950 font-display mt-0.5 uppercase">
                        Total SAR: <span className="text-orange-500">{calculateTotal() === 0 ? "FREE" : calculateTotal()}</span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={selectedSeats.length === 0}
                      className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg transition-all cursor-pointer ${
                        selectedSeats.length === 0
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20"
                      }`}
                    >
                      SECURE SPONSORED SEATS
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="booking-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-4"
              >
                <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto animate-bounce" />
                <h4 className="text-2xl font-black text-slate-900 font-display uppercase tracking-tight">
                  Concert Seats Confirmed!
                </h4>
                <div className="max-w-md mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left text-xs font-mono space-y-2.5">
                  <div className="flex justify-between border-b pb-2 border-slate-200 text-slate-600">
                    <span>Attendee:</span>
                    <span className="font-bold text-slate-900">{userName}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200 text-slate-600">
                    <span>Concert:</span>
                    <span className="font-bold text-slate-900">{selectedConcert.title}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200 text-slate-600">
                    <span>Selected Seats:</span>
                    <span className="font-bold text-orange-600">{selectedSeats.join(", ")}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2 border-slate-200 text-slate-600">
                    <span>Date / Time:</span>
                    <span className="font-bold text-slate-900 font-sans">{selectedConcert.date} @ {selectedConcert.time}</span>
                  </div>
                  <div className="flex justify-between pt-1 text-slate-600">
                    <span>Booking Status:</span>
                    <span className="font-bold text-emerald-600 uppercase font-sans">COMPLIMENTARY ACCESS</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-sans leading-relaxed">
                  A verification SMS ticket has been dispatched to {userPhone}. Present digital code at gate entrance!
                </p>
                <button
                  onClick={() => {
                    setIsBooked(false);
                    setSelectedSeats([]);
                  }}
                  className="px-6 py-2 border-2 border-slate-200 hover:border-orange-500 rounded-full text-xs font-bold text-slate-700 font-mono transition-colors mt-4 cursor-pointer"
                >
                  NEW BOOKING
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

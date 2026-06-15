import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { supabase } from "../lib/supabase";
import { Star, Quote, Plus, Loader2 } from "lucide-react";

type Review = {
  id: string;
  name: string;
  location: string;
  avatar_letter: string;
  color_class: string;
  rating: number;
  review_text: string;
  service_received: string;
  avatar_image_url?: string;
};

const FALLBACK_REVIEWS: Review[] = [
  { id: "1", name: "Ahmed Hassan", location: "Saudi Arabia", avatar_letter: "AH", color_class: "bg-indigo-500", rating: 5, review_text: "The E-Passport application process was incredibly smooth. They guided me through every step, and I received my passport much faster than expected. Highly recommended!", service_received: "E-Passport Application" },
  { id: "2", name: "Sarah Malik", location: "United Arab Emirates", avatar_letter: "SM", color_class: "bg-rose-500", rating: 5, review_text: "I needed a business visa urgently, and the team handled everything flawlessly. Professional, transparent pricing, and excellent communication throughout.", service_received: "Visa Application" },
  { id: "3", name: "Rayan Al-Saud", location: "Qatar", avatar_letter: "RA", color_class: "bg-teal-500", rating: 5, review_text: "Outstanding service! From document preparation to the final submission, they took care of all the headaches. I will definitely use their services again.", service_received: "Business Consultancy" },
];

const CITY_OPTIONS = ["Jeddah", "Riyadh", "Dammam", "Al Khobar", "Medina", "Mecca", "Tabuk"];
const SERVICE_OPTIONS = ["E-Passport Application", "Visa Application", "Investment License", "CR Registration", "Muqeem Portal", "Qiwa Portal", "General Consultancy"];
const COLOR_OPTIONS = ["bg-teal-500", "bg-rose-500", "bg-indigo-500", "bg-amber-500", "bg-emerald-500", "bg-violet-500"];

export default function HappyClientsHub() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", location: "Jeddah", review_text: "", service_received: "E-Passport Application", color_class: "bg-teal-500", rating: 5, avatar_image_url: "" });

  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  useEffect(() => {
    if (reviews.length <= 1) return;

    const timer = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, clientWidth, scrollWidth } = carouselRef.current;

        // ১টি ফুল সেটের মোট উইডথ (যেহেতু আমরা নিচে ডেটা ডাবল করেছি)
        const halfScrollWidth = scrollWidth / 2;
        const cardWidth = window.innerWidth >= 768 ? clientWidth / 3 : clientWidth;

        // যদি স্ক্রোল করতে করতে আমরা প্রথম হাফ পার করে ফেলি
        if (scrollLeft >= halfScrollWidth - 10) {
          // কোনো অ্যানিমেশন ছাড়া চোখের পলকে একদম শুরুতে রিসেট হবে (ইউজার টেরও পাবে না)
          carouselRef.current.scrollTo({ left: 0, behavior: 'auto' });

          // রিসেট হওয়ার সাথে সাথেই পরবর্তী কার্ডে স্মুথলি স্লাইড করবে
          setTimeout(() => {
            if (carouselRef.current) {
              carouselRef.current.scrollTo({ left: cardWidth, behavior: 'smooth' });
            }
          }, 30);
        } else {
          // স্বাভাবিকভাবে বামে স্লাইড হতে থাকবে
          carouselRef.current.scrollTo({ left: scrollLeft + cardWidth, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(timer);
  }, [reviews.length]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.review_text) return;
    setSubmitting(true);

    const isUrl = form.avatar_image_url && (form.avatar_image_url.startsWith("http") || form.avatar_image_url.startsWith("/"));
    const avatar_letter = isUrl ? form.avatar_image_url : form.name.trim().split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

    try {
      // Try to insert with avatar_image_url first
      const { error } = await supabase
        .from("reviews")
        .insert([{ 
          name: form.name, 
          location: form.location, 
          review_text: form.review_text, 
          service_received: form.service_received, 
          color_class: form.color_class, 
          rating: form.rating,
          avatar_letter: avatar_letter,
          avatar_image_url: form.avatar_image_url || null
        }]);

      if (error) {
        // Fallback: If it failed because the column doesn't exist yet, retry without that column
        console.warn("Retrying insert without avatar_image_url column...", error);
        const { error: retryError } = await supabase
          .from("reviews")
          .insert([{ 
            name: form.name, 
            location: form.location, 
            review_text: form.review_text, 
            service_received: form.service_received, 
            color_class: form.color_class, 
            rating: form.rating,
            avatar_letter: avatar_letter
          }]);
        if (retryError) throw retryError;
      }

      setForm({ name: "", location: "Jeddah", review_text: "", service_received: "E-Passport Application", color_class: "bg-teal-500", rating: 5, avatar_image_url: "" });
      setShowAddForm(false);
      await fetchReviews();
    } catch (err) {
      console.error("Error adding review:", err);
      alert("Something went wrong while submitting your review.");
    } finally {
      setSubmitting(false);
    }
  };

  // ইনফিনিট লুপ ট্র্যাকিং এর জন্য রিভিউ লিস্ট ডাবল করা হয়েছে
  const extendedReviews = [...reviews, ...reviews];

  return (
    <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[85vw] mx-auto w-full flex flex-col items-center relative">
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : (
        <div
          ref={carouselRef}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-8 pb-8 pt-12 px-4 w-full"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {extendedReviews.map((review, index) => (
            <div
              // id এর সাথে index যুক্ত করে ইউনিক কি (key) দেওয়া হয়েছে যেন রিঅ্যাক্ট ওয়ার্নিং না দেয়
              key={`${review.id}-${index}`}
              className="snap-start shrink-0 w-full md:w-[calc(33.333%-22px)] relative bg-slate-50 shadow-sm rounded-3xl p-6 md:p-8 xl:p-10 flex flex-col items-center mt-6 group hover:shadow-md transition-shadow"
            >
              {/* Quote Background */}
              <div className="absolute right-6 top-6 text-slate-200 pointer-events-none">
                <Quote className="h-12 w-12 stroke-[2px] opacity-40 group-hover:opacity-70 transition-opacity" />
              </div>

              {/* Avatar Overlap */}
              {review.avatar_image_url || (review.avatar_letter && (review.avatar_letter.startsWith("http") || review.avatar_letter.startsWith("/"))) ? (
                <div className="absolute -top-10 h-20 w-20 xl:h-24 xl:w-24 rounded-full overflow-hidden ring-[6px] ring-white bg-slate-100 flex items-center justify-center shadow-md">
                  <img 
                    src={review.avatar_image_url || review.avatar_letter} 
                    alt={review.name} 
                    className="h-full w-full object-cover" 
                  />
                </div>
              ) : (
                <div className={`absolute -top-10 h-20 w-20 xl:h-24 xl:w-24 rounded-full ${review.color_class || 'bg-indigo-100'} ring-[6px] ring-white flex items-center justify-center shadow-md`}>
                  <span className="text-xl xl:text-2xl font-bold font-display uppercase tracking-wider text-white">
                    {review.avatar_letter}
                  </span>
                </div>
              )}

              {/* Card Content */}
              <div className="mt-10 flex flex-col items-center text-center w-full">
                <h4 className="font-bold text-slate-900 font-display text-lg xl:text-xl 2xl:text-2xl tracking-wide">{review.name}</h4>
                <p className="text-[10px] xl:text-xs 2xl:text-sm font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4">
                  {review.location}
                </p>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <blockquote className="text-sm xl:text-base 2xl:text-lg text-slate-600 italic leading-relaxed">
                  "{review.review_text}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Review Button & Form */}
      <div className="mt-6 mb-4 flex flex-col items-center w-full max-w-2xl px-4">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Review
        </button>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-6 w-full"
            >
              <form onSubmit={handleAddReview} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative text-left">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
                <h4 className="font-bold text-slate-800 text-sm">Add New Testimonial (Admin/Demo)</h4>

                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="Client Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full text-xs px-3 py-2 border rounded-lg" />
                  <select value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full text-xs px-3 py-2 border rounded-lg">
                    {CITY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <select value={form.service_received} onChange={e => setForm({ ...form, service_received: e.target.value })} className="w-full text-xs px-3 py-2 border rounded-lg">
                    {SERVICE_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                  <select value={form.color_class} onChange={e => setForm({ ...form, color_class: e.target.value })} className="w-full text-xs px-3 py-2 border rounded-lg">
                    {COLOR_OPTIONS.map(c => <option key={c} value={c}>{c.replace('bg-', '').replace('-500', '')}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-1">
                  <input 
                    placeholder="Client Photo URL (optional) - e.g., https://example.com/pic.jpg" 
                    value={form.avatar_image_url} 
                    onChange={e => setForm({ ...form, avatar_image_url: e.target.value })} 
                    className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:border-rose-500" 
                  />
                </div>

                <textarea required placeholder="Write review here..." value={form.review_text} onChange={e => setForm({ ...form, review_text: e.target.value })} rows={3} className="w-full text-xs px-3 py-2 border rounded-lg" />

                <button disabled={submitting} type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg text-xs transition-colors tracking-widest uppercase mt-2">
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
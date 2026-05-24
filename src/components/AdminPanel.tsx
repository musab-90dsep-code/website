import React, { useState, useEffect, FormEvent, ChangeEvent, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import {
  Trash2, Plus, ArrowLeft, Save, Upload, Settings,
  MessageSquare, Layers, Star, Image, FileText, Phone,
  Info, RefreshCw, CheckCircle2, XCircle, Edit2, X, Plane
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Lead = { id: string; name: string; requirement: string; status: string; created_at: string };
type Service = { id: string; name: string; order_num: number; type: string };
type Review = { id: string; name: string; location: string; avatar_letter: string; color_class: string; rating: number; review_text: string; service_received: string; created_at: string; avatar_image_url?: string };
type FeatureCard = { id: string; title: string; description: string; icon_name: string; color: string; order_num: number };
type Setting = { key: string; value: string; label: string; group_name: string };
type EPassportRequirement = { id: string; title: string; desc_text: string; icon_name: string; color: string; order_num: number };
type VisaCountry = { id: string; name: string; type: string; desc_text: string; icon_bg: string; icon_color: string; order_num: number };

// ─── Toast Component ─────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-bold ${type === "success" ? "bg-teal-500 text-white" : "bg-red-500 text-white"}`}>
      {type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      {message}
      <button onClick={onClose}><X className="w-3 h-3" /></button>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabButton({ label, icon: Icon, active, onClick }: { key?: React.Key; label: string; icon: any; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${active ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"}`}>
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-black text-sm text-slate-800 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  type TabId = "leads" | "services" | "reviews" | "feature_cards" | "settings" | "site_text" | "contact" | "epassport_visa";
  const [activeTab, setActiveTab] = useState<TabId>("leads");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  // Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [epassportReqs, setEpassportReqs] = useState<EPassportRequirement[]>([]);
  const [visaCountries, setVisaCountries] = useState<VisaCountry[]>([]);

  // Form states
  const [newReview, setNewReview] = useState({ name: "", location: "Jeddah", avatar_letter: "", rating: 5, review_text: "", service_received: "", color_class: "bg-teal-500", avatar_image_url: "" });
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceType, setNewServiceType] = useState("trading");
  const [newCard, setNewCard] = useState({ title: "", description: "", icon_name: "FileText", color: "rose", order_num: 0 });
  const [newEpassReq, setNewEpassReq] = useState({ title: "", desc_text: "", icon_name: "FileText", color: "blue", order_num: 1 });
  const [newVisaCountry, setNewVisaCountry] = useState({ name: "", type: "", desc_text: "", icon_bg: "bg-blue-100", icon_color: "text-blue-600", order_num: 1 });
  const [editingCard, setEditingCard] = useState<FeatureCard | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [heroPreviewMode, setHeroPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [passportPreviewMode, setPassportPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [visaPreviewMode, setVisaPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const showToast = (message: string, type: "success" | "error" = "success") => setToast({ message, type });

  // ── Auth ──────────────────────────────────────────────────────────────────
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    const correct = (import.meta as any).env.VITE_ADMIN_PASSCODE || "1234";
    if (passcode === correct) { setIsAuthenticated(true); fetchAll(); }
    else setLoginError("Invalid passcode. Please try again.");
  };

  // ── Fetch All ─────────────────────────────────────────────────────────────
  const fetchAll = async () => {
    setLoading(true);
    const [leadsRes, servRes, revRes, featRes, setRes, epassRes, visaRes] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("services").select("*").order("order_num"),
      supabase.from("reviews").select("*").order("created_at", { ascending: false }),
      supabase.from("feature_cards").select("*").order("order_num"),
      supabase.from("site_settings").select("*"),
      supabase.from("epassport_requirements").select("*").order("order_num", { ascending: true }),
      supabase.from("visa_countries").select("*").order("order_num", { ascending: true })
    ]);

    if (leadsRes.data) setLeads(leadsRes.data);
    if (servRes.data) setServices(servRes.data);
    if (revRes.data) setReviews(revRes.data);
    if (featRes.data) setFeatureCards(featRes.data);

    // Catch errors for non-existent tables gracefully
    if (epassRes.data) setEpassportReqs(epassRes.data);
    if (visaRes.data) setVisaCountries(visaRes.data);

    if (setRes.data) {
      const map: Record<string, string> = {};
      setRes.data.forEach((x: Setting) => { map[x.key] = x.value; });
      setSettings(map);
    }
    setLoading(false);
  };

  // ── Leads ─────────────────────────────────────────────────────────────────
  const updateLeadStatus = async (id: string, status: string) => {
    await supabase.from("leads").update({ status }).eq("id", id);
    fetchAll();
    showToast("Lead status updated");
  };
  const deleteLead = async (id: string) => {
    await supabase.from("leads").delete().eq("id", id);
    fetchAll();
    showToast("Lead deleted");
  };

  // ── Services ──────────────────────────────────────────────────────────────
  const addService = async (e: FormEvent) => {
    e.preventDefault();
    if (!newServiceName) return;
    await supabase.from("services").insert([{ name: newServiceName, type: newServiceType, order_num: services.length + 1 }]);
    setNewServiceName("");
    fetchAll();
    showToast("Service added");
  };
  const deleteService = async (id: string) => {
    await supabase.from("services").delete().eq("id", id);
    fetchAll();
    showToast("Service deleted");
  };

  // ── Reviews ───────────────────────────────────────────────────────────────
  const addReview = async (e: FormEvent) => {
    e.preventDefault();
    const isUrl = newReview.avatar_image_url && (newReview.avatar_image_url.startsWith("http") || newReview.avatar_image_url.startsWith("/"));
    const avatarLetter = isUrl ? newReview.avatar_image_url : (newReview.avatar_letter || newReview.name.charAt(0).toUpperCase());
    
    try {
      // Try with avatar_image_url column
      const { error } = await supabase.from("reviews").insert([{ 
        name: newReview.name,
        location: newReview.location,
        rating: newReview.rating,
        review_text: newReview.review_text,
        service_received: newReview.service_received,
        color_class: newReview.color_class,
        avatar_letter: avatarLetter,
        avatar_image_url: newReview.avatar_image_url || null
      }]);
      
      if (error) {
        // Fallback: retry without avatar_image_url
        console.warn("Retrying insert without avatar_image_url column...", error);
        const { error: retryErr } = await supabase.from("reviews").insert([{ 
          name: newReview.name,
          location: newReview.location,
          rating: newReview.rating,
          review_text: newReview.review_text,
          service_received: newReview.service_received,
          color_class: newReview.color_class,
          avatar_letter: avatarLetter
        }]);
        if (retryErr) throw retryErr;
      }
    } catch (err) {
      console.error("Failed to add review", err);
    }

    setNewReview({ name: "", location: "Jeddah", avatar_letter: "", rating: 5, review_text: "", service_received: "", color_class: "bg-teal-500", avatar_image_url: "" });
    fetchAll();
    showToast("Review added");
  };
  const updateReview = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    const isUrl = editingReview.avatar_image_url && (editingReview.avatar_image_url.startsWith("http") || editingReview.avatar_image_url.startsWith("/"));
    const avatarLetter = isUrl ? editingReview.avatar_image_url : (editingReview.avatar_letter || editingReview.name.charAt(0).toUpperCase());
    
    try {
      // Try with avatar_image_url column
      const { error } = await supabase.from("reviews").update({
        name: editingReview.name,
        location: editingReview.location,
        rating: editingReview.rating,
        review_text: editingReview.review_text,
        service_received: editingReview.service_received,
        color_class: editingReview.color_class,
        avatar_letter: avatarLetter,
        avatar_image_url: editingReview.avatar_image_url || null
      }).eq("id", editingReview.id);
      
      if (error) {
        // Fallback: retry without avatar_image_url
        console.warn("Retrying update without avatar_image_url column...", error);
        const { error: retryErr } = await supabase.from("reviews").update({
          name: editingReview.name,
          location: editingReview.location,
          rating: editingReview.rating,
          review_text: editingReview.review_text,
          service_received: editingReview.service_received,
          color_class: editingReview.color_class,
          avatar_letter: avatarLetter
        }).eq("id", editingReview.id);
        if (retryErr) throw retryErr;
      }
    } catch (err) {
      console.error("Failed to update review", err);
    }

    setEditingReview(null);
    fetchAll();
    showToast("Review updated");
  };
  const deleteReview = async (id: string) => {
    await supabase.from("reviews").delete().eq("id", id);
    fetchAll();
    showToast("Review deleted");
  };

  // ── Feature Cards ─────────────────────────────────────────────────────────
  const addFeatureCard = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from("feature_cards").insert([{ ...newCard, order_num: featureCards.length + 1 }]);
    setNewCard({ title: "", description: "", icon_name: "FileText", color: "rose", order_num: 0 });
    fetchAll();
    showToast("Feature card added");
  };
  const updateFeatureCard = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingCard) return;
    await supabase.from("feature_cards").update(editingCard).eq("id", editingCard.id);
    setEditingCard(null);
    fetchAll();
    showToast("Card updated");
  };
  const deleteFeatureCard = async (id: string) => {
    await supabase.from("feature_cards").delete().eq("id", id);
    fetchAll();
    showToast("Card deleted");
  };

  // ── Passport & Visa ───────────────────────────────────────────────────────
  const addEpassReq = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from("epassport_requirements").insert([{ ...newEpassReq, order_num: epassportReqs.length + 1 }]);
    setNewEpassReq({ title: "", desc_text: "", icon_name: "FileText", color: "blue", order_num: 1 });
    fetchAll();
    showToast("Requirement added");
  };
  const deleteEpassReq = async (id: string) => {
    await supabase.from("epassport_requirements").delete().eq("id", id);
    fetchAll();
    showToast("Requirement deleted");
  };
  const addVisaCountry = async (e: FormEvent) => {
    e.preventDefault();
    await supabase.from("visa_countries").insert([{ ...newVisaCountry, order_num: visaCountries.length + 1 }]);
    setNewVisaCountry({ name: "", type: "", desc_text: "", icon_bg: "bg-blue-100", icon_color: "text-blue-600", order_num: 1 });
    fetchAll();
    showToast("Country added");
  };
  const deleteVisaCountry = async (id: string) => {
    await supabase.from("visa_countries").delete().eq("id", id);
    fetchAll();
    showToast("Country deleted");
  };

  // ── Settings ──────────────────────────────────────────────────────────────
  const saveSetting = async (key: string, value: string) => {
    await supabase.from("site_settings").upsert({ key, value }, { onConflict: "key" });
    // আপডেট হওয়ার পর লোকাল স্টেট রিফ্রেশ করা যাতে অন্য ট্যাবেও ডাটা সিঙ্ক থাকে
    setSettings(prev => ({ ...prev, [key]: value }));
    showToast("Saved successfully!");
  };

  const handleReviewPhotoUpload = async (e: ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `client_review_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
      
      if (isEdit) {
        setEditingReview(p => p ? { ...p, avatar_image_url: publicUrl } : null);
      } else {
        setNewReview(p => ({ ...p, avatar_image_url: publicUrl }));
      }
      showToast("Client photo uploaded successfully!");
    } catch (err: any) {
      showToast(err.message || "Photo upload failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `hero_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
      await supabase.from("site_settings").upsert({ key: "hero_image_url", value: publicUrl }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, hero_image_url: publicUrl }));
      showToast("Hero image updated! Refresh the site to see it.");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageDelete = async () => {
    if (!confirm("Are you sure you want to delete the hero image and reset to default?")) return;
    setIsUploading(true);
    try {
      const currentUrl = settings.hero_image_url || "";
      if (currentUrl.includes("supabase") && currentUrl.includes("/images/")) {
        const parts = currentUrl.split("/images/");
        if (parts[1]) {
          await supabase.storage.from("images").remove([parts[1]]);
        }
      }
      await supabase.from("site_settings").upsert({ key: "hero_image_url", value: "/image.png" }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, hero_image_url: "/image.png" }));
      showToast("Hero image deleted and reset to default!");
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `logo_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
      await supabase.from("site_settings").upsert({ key: "brand_logo_image_url", value: publicUrl }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, brand_logo_image_url: publicUrl }));
      showToast("Brand logo image updated successfully!");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogoDelete = async () => {
    if (!confirm("Are you sure you want to delete the logo image and reset to the text/letter logo?")) return;
    setIsUploading(true);
    try {
      const currentUrl = settings.brand_logo_image_url || "";
      if (currentUrl.includes("supabase") && currentUrl.includes("/images/")) {
        const parts = currentUrl.split("/images/");
        if (parts[1]) {
          await supabase.storage.from("images").remove([parts[1]]);
        }
      }
      await supabase.from("site_settings").upsert({ key: "brand_logo_image_url", value: "" }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, brand_logo_image_url: "" }));
      showToast("Logo image reset to default text/letter logo!");
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePassportCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `passport_cover_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
      await supabase.from("site_settings").upsert({ key: "passport_cover_image_url", value: publicUrl }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, passport_cover_image_url: publicUrl }));
      showToast("E-Passport cover image updated successfully!");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePassportCoverDelete = async () => {
    if (!confirm("Are you sure you want to delete the passport cover image and reset to default?")) return;
    setIsUploading(true);
    try {
      const currentUrl = settings.passport_cover_image_url || "";
      if (currentUrl.includes("supabase") && currentUrl.includes("/images/")) {
        const parts = currentUrl.split("/images/");
        if (parts[1]) {
          await supabase.storage.from("images").remove([parts[1]]);
        }
      }
      await supabase.from("site_settings").upsert({ key: "passport_cover_image_url", value: "" }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, passport_cover_image_url: "" }));
      showToast("Passport cover image reset to default!");
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVisaCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const fileName = `visa_cover_${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("images").upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
      await supabase.from("site_settings").upsert({ key: "visa_cover_image_url", value: publicUrl }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, visa_cover_image_url: publicUrl }));
      showToast("Visa cover image updated successfully!");
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleVisaCoverDelete = async () => {
    if (!confirm("Are you sure you want to delete the visa cover image and reset to default?")) return;
    setIsUploading(true);
    try {
      const currentUrl = settings.visa_cover_image_url || "";
      if (currentUrl.includes("supabase") && currentUrl.includes("/images/")) {
        const parts = currentUrl.split("/images/");
        if (parts[1]) {
          await supabase.storage.from("images").remove([parts[1]]);
        }
      }
      await supabase.from("site_settings").upsert({ key: "visa_cover_image_url", value: "" }, { onConflict: "key" });
      setSettings(prev => ({ ...prev, visa_cover_image_url: "" }));
      showToast("Visa cover image reset to default!");
    } catch (err: any) {
      showToast(err.message || "Delete failed", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // ── Login Screen ──────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200">
          <button onClick={onBack} className="flex items-center gap-2 text-slate-400 mb-6 hover:text-slate-700 transition-colors text-xs font-bold uppercase tracking-wider">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Site
          </button>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center font-black text-white text-xl italic mb-4">A</div>
          <h2 className="text-xl font-black text-slate-900 mb-1">Admin Dashboard</h2>
          <p className="text-xs text-slate-500 mb-6">Al Nazim Travels · Secure Access</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Passcode</label>
              <input type="password" value={passcode} onChange={e => setPasscode(e.target.value)} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-rose-500 transition-colors" placeholder="Enter passcode" />
            </div>
            {loginError && <p className="text-red-500 text-xs font-bold">{loginError}</p>}
            <button type="submit" className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  const tabs = [
    { id: "leads" as TabId, label: "Leads", icon: MessageSquare },
    { id: "services" as TabId, label: "Services", icon: Layers },
    { id: "reviews" as TabId, label: "Reviews", icon: Star },
    { id: "feature_cards" as TabId, label: "Cards", icon: FileText },
    { id: "epassport_visa" as TabId, label: "Passport & Visa", icon: Plane },
    { id: "site_text" as TabId, label: "Text & Brand", icon: Edit2 },
    { id: "contact" as TabId, label: "Contact", icon: Phone },
    { id: "settings" as TabId, label: "Media", icon: Image },
  ];

  const heroKeys = ["hero_badge_text", "hero_title_line1", "hero_title_line2", "hero_location", "hero_tagline", "hero_cta_button"];
  const brandKeys = ["brand_name", "brand_sub", "brand_logo_text", "footer_company_name", "footer_copyright"];
  const aboutKeys = ["why_choose_title", "why_choose_para1", "why_choose_para2"];
  const servicesSectionKeys = ["services_section_title", "services_section_subtitle", "testimonials_section_title", "testimonials_section_subtitle"];
  const contactKeys = ["contact_phone", "contact_email", "contact_address", "contact_whatsapp", "email_notification_key"];

  // চাকার জন্য নতুন কী ডেফিনিশন গ্রুপ
  const wheelKeys = ["wheel_winner_line1", "wheel_winner_line2"];

  const SettingField = ({ settingKey, onSave }: { key?: React.Key; settingKey: string; onSave: (key: string, val: string) => void }) => {
    const [val, setVal] = useState(settings[settingKey] || "");

    // সেটিংস চেঞ্জ হলে ইনপুট ভ্যালু সিঙ্ক রাখার জন্য
    useEffect(() => {
      setVal(settings[settingKey] || "");
    }, [settings, settingKey]);

    const isLong = val.length > 80;
    return (
      <div className="space-y-1.5">
        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">{settingKey.replace(/_/g, " ")}</label>
        {isLong ? (
          <textarea value={val} onChange={e => setVal(e.target.value)} rows={3} className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500 resize-none" />
        ) : (
          <input type="text" value={val} onChange={e => setVal(e.target.value)} className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-rose-500" />
        )}
        <button onClick={() => onSave(settingKey, val)} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-teal-600 transition-colors">
          <Save className="w-3 h-3" /> Save
        </button>
      </div>
    );
  };

  const colorOptions = ["rose", "orange", "teal", "indigo", "emerald", "amber"];
  const iconOptions = ["FileText", "Plane", "DollarSign", "Award", "Star", "Building2", "Sparkles", "CheckCircle2"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center font-black text-white italic text-sm">A</div>
            <div>
              <h1 className="font-black text-slate-900 text-sm">Admin Dashboard</h1>
              <p className="text-[10px] text-slate-400 font-mono">Al Nazim Travels · Content Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchAll} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
              <ArrowLeft className="w-3 h-3" /> Exit
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Leads", value: leads.length, color: "rose" },
            { label: "New Leads", value: leads.filter(l => l.status === "new").length, color: "orange" },
            { label: "Services", value: services.length, color: "teal" },
            { label: "Reviews", value: reviews.length, color: "indigo" },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center">
              <div className={`text-3xl font-black text-${stat.color}-500`}>{stat.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <TabButton key={tab.id} label={tab.label} icon={tab.icon} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id as TabId)} />
          ))}
        </div>

        {/* ── LEADS TAB ─────────────────────────────────────────────────── */}
        {activeTab === "leads" && (
          <div className="space-y-4">
            <SectionCard title={`Consultation Leads (${leads.length})`}>
              {leads.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No leads yet. They will appear here when clients submit the consult form.</p>
              ) : (
                <div className="space-y-3">
                  {leads.map(lead => (
                    <div key={lead.id} className={`p-4 rounded-xl border flex justify-between items-start gap-4 ${lead.status === "new" ? "bg-rose-50 border-rose-200" : lead.status === "done" ? "bg-teal-50 border-teal-200" : "bg-slate-50 border-slate-200"}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-slate-900 text-sm">{lead.name}</h4>
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${lead.status === "new" ? "bg-rose-500 text-white" : lead.status === "done" ? "bg-teal-500 text-white" : "bg-slate-400 text-white"}`}>{lead.status}</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{lead.requirement}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{new Date(lead.created_at).toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col gap-1.5 shrink-0">
                        <select value={lead.status} onChange={e => updateLeadStatus(lead.id, e.target.value)} className="text-[10px] border border-slate-200 rounded-lg px-2 py-1 bg-white font-bold">
                          <option value="new">New</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>
                        <button onClick={() => deleteLead(lead.id)} className="flex items-center justify-center gap-1 text-[10px] text-red-500 border border-red-200 px-2 py-1 rounded-lg hover:bg-red-50 font-bold">
                          <Trash2 className="w-3 h-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>
        )}

        {/* ── SERVICES TAB ──────────────────────────────────────────────── */}
        {activeTab === "services" && (
          <SectionCard title="Spin Wheel Services">
            <form onSubmit={addService} className="flex gap-3 mb-8">
              <input type="text" value={newServiceName} onChange={e => setNewServiceName(e.target.value)} placeholder="New service name…" className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-rose-500" />
              <select value={newServiceType} onChange={e => setNewServiceType(e.target.value)} className="text-sm border border-slate-200 rounded-xl px-4 py-2.5 bg-white focus:outline-none focus:border-rose-500">
                <option value="trading">Trading Licence</option>
                <option value="service">Service Licence</option>
              </select>
              <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors">
                <Plus className="w-4 h-4" /> Add
              </button>
            </form>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Trading Services */}
              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Trading Licence Services</h4>
                <div className="space-y-2">
                  {services.filter(s => s.type === "trading").map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 font-mono w-5">{i + 1}</span>
                        <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                      </div>
                      <button onClick={() => deleteService(s.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {services.filter(s => s.type === "trading").length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No trading services added yet.</p>
                  )}
                </div>
              </div>

              {/* Service Licence Services */}
              <div>
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Service Licence Services</h4>
                <div className="space-y-2">
                  {services.filter(s => s.type === "service").map((s, i) => (
                    <div key={s.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-slate-400 font-mono w-5">{i + 1}</span>
                        <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                      </div>
                      <button onClick={() => deleteService(s.id)} className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {services.filter(s => s.type === "service").length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No service licences added yet.</p>
                  )}
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── REVIEWS TAB ───────────────────────────────────────────────── */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {/* Add Review Form */}
            {!editingReview ? (
              <SectionCard title="Add New Review">
                <form onSubmit={addReview} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Client Name *</label>
                    <input required type="text" value={newReview.name} onChange={e => setNewReview(p => ({ ...p, name: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500" placeholder="e.g. Ahmed Hassan" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Location *</label>
                    <input required type="text" value={newReview.location} onChange={e => setNewReview(p => ({ ...p, location: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500" placeholder="e.g. Riyadh, Saudi Arabia" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Service Received *</label>
                    <input required type="text" value={newReview.service_received} onChange={e => setNewReview(p => ({ ...p, service_received: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500" placeholder="e.g. Visa Application" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rating</label>
                    <select value={newReview.rating} onChange={e => setNewReview(p => ({ ...p, rating: +e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-500">
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Client Photo</label>
                    <div className="flex items-center gap-3">
                      {newReview.avatar_image_url ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-slate-200 group">
                          <img src={newReview.avatar_image_url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setNewReview(p => ({ ...p, avatar_image_url: "" }))}
                            className="absolute inset-0 bg-black/60 text-white font-bold text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300 text-slate-400 font-mono text-[9px]">
                          No Photo
                        </div>
                      )}
                      <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload className="w-3 h-3" />
                        {isUploading ? "Uploading..." : "Upload Photo"}
                        <input type="file" accept="image/*" disabled={isUploading} onChange={e => handleReviewPhotoUpload(e, false)} className="hidden" />
                      </label>
                      <span className="text-[10px] text-slate-400">or</span>
                      <input type="text" value={newReview.avatar_image_url} onChange={e => setNewReview(p => ({ ...p, avatar_image_url: e.target.value }))} className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-rose-500" placeholder="Paste image link here..." />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Review Text *</label>
                    <textarea required rows={3} value={newReview.review_text} onChange={e => setNewReview(p => ({ ...p, review_text: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 resize-none" placeholder="Write the client's testimonial…" />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors">
                      <Plus className="w-4 h-4" /> Add Review
                    </button>
                  </div>
                </form>
              </SectionCard>
            ) : (
              <SectionCard title="Edit Review">
                <form onSubmit={updateReview} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Name</label>
                    <input type="text" value={editingReview.name} onChange={e => setEditingReview(p => p ? { ...p, name: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Location</label>
                    <input type="text" value={editingReview.location} onChange={e => setEditingReview(p => p ? { ...p, location: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Service Received</label>
                    <input type="text" value={editingReview.service_received} onChange={e => setEditingReview(p => p ? { ...p, service_received: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Rating</label>
                    <select value={editingReview.rating} onChange={e => setEditingReview(p => p ? { ...p, rating: +e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 bg-white focus:outline-none">
                      {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Client Photo</label>
                    <div className="flex items-center gap-3">
                      {editingReview.avatar_image_url ? (
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border border-slate-200 group">
                          <img src={editingReview.avatar_image_url} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setEditingReview(p => p ? { ...p, avatar_image_url: "" } : null)}
                            className="absolute inset-0 bg-black/60 text-white font-bold text-[9px] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300 text-slate-400 font-mono text-[9px]">
                          No Photo
                        </div>
                      )}
                      <label className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                        <Upload className="w-3 h-3" />
                        {isUploading ? "Uploading..." : "Upload Photo"}
                        <input type="file" accept="image/*" disabled={isUploading} onChange={e => handleReviewPhotoUpload(e, true)} className="hidden" />
                      </label>
                      <span className="text-[10px] text-slate-400">or</span>
                      <input type="text" value={editingReview.avatar_image_url || ""} onChange={e => setEditingReview(p => p ? { ...p, avatar_image_url: e.target.value } : null)} className="flex-1 text-xs border border-rose-300 rounded-lg px-3 py-1.5 focus:outline-none" placeholder="Paste image link here..." />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Review Text</label>
                    <textarea rows={3} value={editingReview.review_text} onChange={e => setEditingReview(p => p ? { ...p, review_text: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 focus:outline-none resize-none" />
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => setEditingReview(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-xl font-bold text-sm hover:bg-teal-600">
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              </SectionCard>
            )}

            {/* Reviews List */}
            <SectionCard title={`Existing Reviews (${reviews.length})`}>
              <div className="space-y-3">
                {reviews.map(r => (
                  <div key={r.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    {r.avatar_image_url || (r.avatar_letter && (r.avatar_letter.startsWith("http") || r.avatar_letter.startsWith("/"))) ? (
                      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200">
                        <img src={r.avatar_image_url || r.avatar_letter} alt={r.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className={`w-10 h-10 rounded-full ${r.color_class} flex items-center justify-center text-white font-black text-sm shrink-0`}>{r.avatar_letter}</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">{r.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">· {r.location}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 italic">"{r.review_text}"</p>
                      <span className="text-[10px] text-rose-500 font-bold">{r.service_received}</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => setEditingReview(r)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteReview(r.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── FEATURE CARDS TAB ─────────────────────────────────────────── */}
        {activeTab === "feature_cards" && (
          <div className="space-y-6">
            {!editingCard ? (
              <SectionCard title="Add New Service Card">
                <form onSubmit={addFeatureCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Title *</label>
                    <input required type="text" value={newCard.title} onChange={e => setNewCard(p => ({ ...p, title: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500" placeholder="e.g. E-Passport Application" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Color Theme</label>
                    <select value={newCard.color} onChange={e => setNewCard(p => ({ ...p, color: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-500">
                      {colorOptions.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Icon</label>
                    <select value={newCard.icon_name} onChange={e => setNewCard(p => ({ ...p, icon_name: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:border-rose-500">
                      {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Description *</label>
                    <textarea required rows={3} value={newCard.description} onChange={e => setNewCard(p => ({ ...p, description: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-rose-500 resize-none" placeholder="Card description…" />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <button type="submit" className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold text-sm hover:bg-rose-600 transition-colors">
                      <Plus className="w-4 h-4" /> Add Card
                    </button>
                  </div>
                </form>
              </SectionCard>
            ) : (
              <SectionCard title="Edit Feature Card">
                <form onSubmit={updateFeatureCard} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Title</label>
                    <input type="text" value={editingCard.title} onChange={e => setEditingCard(p => p ? { ...p, title: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Color</label>
                    <select value={editingCard.color} onChange={e => setEditingCard(p => p ? { ...p, color: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 bg-white focus:outline-none">
                      {colorOptions.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Icon</label>
                    <select value={editingCard.icon_name} onChange={e => setEditingCard(p => p ? { ...p, icon_name: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 bg-white focus:outline-none">
                      {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Description</label>
                    <textarea rows={3} value={editingCard.description} onChange={e => setEditingCard(p => p ? { ...p, description: e.target.value } : null)} className="w-full text-sm border border-rose-300 rounded-xl px-3 py-2 focus:outline-none resize-none" />
                  </div>
                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <button type="button" onClick={() => setEditingCard(null)} className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                    <button type="submit" className="flex items-center gap-2 px-6 py-2 bg-teal-500 text-white rounded-xl font-bold text-sm hover:bg-teal-600">
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>
                </form>
              </SectionCard>
            )}

            <SectionCard title={`Service Cards on Homepage (${featureCards.length})`}>
              <div className="space-y-3">
                {featureCards.map(card => (
                  <div key={card.id} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className={`w-10 h-10 rounded-xl bg-${card.color}-100 flex items-center justify-center text-${card.color}-600 shrink-0`}>
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 text-sm">{card.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{card.description}</p>
                      <span className={`text-[10px] font-black text-${card.color}-500 uppercase tracking-wider`}>{card.color} · {card.icon_name}</span>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => setEditingCard(card)} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => deleteFeatureCard(card.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── SITE TEXT TAB ─────────────────────────────────────────────── */}
        {activeTab === "site_text" && (
          <div className="space-y-6">
            {/* চাকার সবুজ ঘরের রিওয়ার্ড পরিবর্তনের জন্য নতুন সেকশন */}
            <SectionCard title="Spin Wheel Config (Trading Licence Winner)">
              <div className="space-y-5">
                <p className="text-xs text-slate-500">বাম পাশের স্পিন হুইল এর বিজয়ী (সবুজ অংশ) ঘরের ১ ও ২ নম্বর লাইনের লেখা এখান থেকে পরিবর্তন করতে পারবেন।</p>
                {["wheel1_winner_line1", "wheel1_winner_line2"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>

            <SectionCard title="Spin Wheel Config (Service Licence Winner)">
              <div className="space-y-5">
                <p className="text-xs text-slate-500">ডান পাশের স্পিন হুইল এর বিজয়ী (সবুজ অংশ) ঘরের ১ ও ২ নম্বর লাইনের লেখা এখান থেকে পরিবর্তন করতে পারবেন।</p>
                {["wheel2_winner_line1", "wheel2_winner_line2"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>

            <SectionCard title="Hero Section">
              <div className="space-y-5">
                {heroKeys.map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>
            <SectionCard title="Brand & Footer">
              <div className="space-y-5">
                {brandKeys.map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>
            <SectionCard title="Why Choose Us">
              <div className="space-y-5">
                {aboutKeys.map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>
            <SectionCard title="Section Titles">
              <div className="space-y-5">
                {servicesSectionKeys.map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── PASSPORT & VISA TAB ───────────────────────────────────────── */}
        {activeTab === "epassport_visa" && (
          <div className="space-y-6">
            <SectionCard title="E-Passport Page Content">
              <div className="space-y-5">
                {["epassport_page_title", "epassport_page_subtitle", "epassport_req_title", "epassport_req_subtitle"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>

            <SectionCard title={`E-Passport Requirements (${epassportReqs.length})`}>
              <div className="space-y-4">
                <form onSubmit={addEpassReq} className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" value={newEpassReq.title} onChange={e => setNewEpassReq(p => ({ ...p, title: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2" placeholder="Requirement Title" />
                  <input required type="text" value={newEpassReq.desc_text} onChange={e => setNewEpassReq(p => ({ ...p, desc_text: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2" placeholder="Description" />
                  <select value={newEpassReq.icon_name} onChange={e => setNewEpassReq(p => ({ ...p, icon_name: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2">
                    {iconOptions.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <select value={newEpassReq.color} onChange={e => setNewEpassReq(p => ({ ...p, color: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2">
                    {colorOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <button type="submit" className="md:col-span-2 py-2 bg-rose-500 text-white rounded-xl font-bold text-xs">Add Requirement</button>
                </form>
                {epassportReqs.map(req => (
                  <div key={req.id} className="p-4 border rounded-xl flex justify-between items-center bg-white">
                    <div>
                      <h4 className="font-bold text-sm">{req.title}</h4>
                      <p className="text-xs text-slate-500">{req.desc_text}</p>
                    </div>
                    <button onClick={() => deleteEpassReq(req.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Visa Page Content">
              <div className="space-y-5">
                {["visa_page_title", "visa_page_subtitle", "visa_destinations_title", "visa_destinations_subtitle"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>

            <SectionCard title={`Visa Countries (${visaCountries.length})`}>
              <div className="space-y-4">
                <form onSubmit={addVisaCountry} className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required type="text" value={newVisaCountry.name} onChange={e => setNewVisaCountry(p => ({ ...p, name: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2" placeholder="Country Name (e.g. Saudi Arabia)" />
                  <input required type="text" value={newVisaCountry.type} onChange={e => setNewVisaCountry(p => ({ ...p, type: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2" placeholder="Visa Type (e.g. Tourist and Visit)" />
                  <input required type="text" value={newVisaCountry.desc_text} onChange={e => setNewVisaCountry(p => ({ ...p, desc_text: e.target.value }))} className="md:col-span-2 w-full text-sm border border-slate-200 rounded-xl px-3 py-2" placeholder="Description" />
                  <input required type="text" value={newVisaCountry.icon_bg} onChange={e => setNewVisaCountry(p => ({ ...p, icon_bg: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2" placeholder="Icon BG Class (e.g. bg-emerald-100)" />
                  <input required type="text" value={newVisaCountry.icon_color} onChange={e => setNewVisaCountry(p => ({ ...p, icon_color: e.target.value }))} className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2" placeholder="Icon Color Class (e.g. text-emerald-600)" />
                  <button type="submit" className="md:col-span-2 py-2 bg-rose-500 text-white rounded-xl font-bold text-xs">Add Country</button>
                </form>
                {visaCountries.map(country => (
                  <div key={country.id} className="p-4 border rounded-xl flex justify-between items-center bg-white">
                    <div>
                      <h4 className="font-bold text-sm">{country.name} <span className="text-[10px] text-slate-400 font-normal">({country.type})</span></h4>
                      <p className="text-xs text-slate-500">{country.desc_text}</p>
                    </div>
                    <button onClick={() => deleteVisaCountry(country.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── CONTACT TAB ───────────────────────────────────────────────── */}
        {activeTab === "contact" && (
          <div className="space-y-6">
            <SectionCard title="Main Landing Page - Live Query Desk">
              <div className="space-y-5">
                {["contact_phone", "contact_email", "contact_address", "contact_whatsapp"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>

            <SectionCard title="E-Passport Page - Live Query Desk">
              <div className="space-y-5">
                {["passport_contact_title", "passport_contact_subtitle", "passport_contact_phone", "passport_contact_email", "passport_contact_address", "passport_whatsapp"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>

            <SectionCard title="Visa Page - Live Query Desk">
              <div className="space-y-5">
                {["visa_contact_title", "visa_contact_subtitle", "visa_contact_phone", "visa_contact_email", "visa_contact_address", "visa_whatsapp"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>

            <SectionCard title="Form Email Notifications">
              <div className="space-y-5">
                {["email_notification_key"].map(k => <SettingField key={k} settingKey={k} onSave={saveSetting} />)}
              </div>
            </SectionCard>
          </div>
        )}

        {/* ── MEDIA TAB ─────────────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <SectionCard title="Hero Image">
              <p className="text-xs text-slate-500 mb-4">Upload a new image to replace the main hero background on the homepage. Recommended: 1920×1080px or similar wide-format image.</p>

              {settings.hero_image_url && (
                <div className="mb-6">
                  {/* Dynamic Device Preview Toggle */}
                  <div className="flex items-center justify-between mb-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 max-w-xs">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Device View Mock:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setHeroPreviewMode("desktop")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${heroPreviewMode === "desktop" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
                      >
                        Desktop
                      </button>
                      <button
                        onClick={() => setHeroPreviewMode("mobile")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${heroPreviewMode === "mobile" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>

                  <div className={`rounded-2xl overflow-hidden border border-slate-200 relative group bg-slate-950 shadow-inner transition-all duration-300 ${heroPreviewMode === "desktop" ? "aspect-[21/9] w-full" : "aspect-[9/16] w-[260px] mx-auto"
                    }`}>
                    <img src={settings.hero_image_url} alt="Current hero" className="w-full h-full object-cover object-center opacity-70" />

                    {/* Safe zone indicator grid */}
                    <div className="absolute inset-4 border border-white/20 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                      <span className="text-[8px] text-white/40 font-mono tracking-widest uppercase">Safe Zone Grid</span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-white font-mono text-[8px] font-black uppercase tracking-wider mb-2">Live Web Banner View</span>
                      <h1 className={`${heroPreviewMode === "desktop" ? "text-sm md:text-lg" : "text-xs"} font-black text-white leading-tight drop-shadow-md`}>{settings.brand_name || "AL NAZIM TRAVELS"}</h1>
                      <p className={`${heroPreviewMode === "desktop" ? "text-[8px]" : "text-[6px]"} text-slate-300 font-medium drop-shadow-sm mt-1 max-w-[180px] mx-auto`}>
                        {heroPreviewMode === "desktop" ? "Hero Background Banner (Centered Crop)" : "Mobile Tall Crop"}
                      </p>
                    </div>
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all flex items-center justify-center">
                      <button
                        onClick={handleImageDelete}
                        disabled={isUploading}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 shadow-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete & Reset to Default
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload area */}
              <label className={`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isUploading ? "border-rose-300 bg-rose-50" : "border-slate-300 hover:border-rose-400 hover:bg-rose-50/40"}`}>
                <Upload className={`w-8 h-8 ${isUploading ? "text-rose-500 animate-bounce" : "text-slate-400"}`} />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">{isUploading ? "Working..." : "Click to upload new hero image"}</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP supported</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
              </label>

              <button
                onClick={handleImageDelete}
                disabled={isUploading}
                className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-400 transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Current Image &amp; Reset to Default
              </button>
            </SectionCard>

            <SectionCard title="Brand Logo Image">
              <p className="text-xs text-slate-500 mb-4">Upload a custom logo image (PNG with transparency is highly recommended). If uploaded, it will replace the default text/letter icon in the navigation bar.</p>

              {settings.brand_logo_image_url ? (
                <div className="mb-4 rounded-xl overflow-hidden bg-slate-900/10 p-4 flex flex-col items-center justify-center relative group min-h-[100px] border border-slate-200">
                  <img src={settings.brand_logo_image_url} alt="Current Logo" className="h-12 object-contain bg-slate-950/20 p-2 rounded-xl" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all flex items-center justify-center">
                    <button
                      onClick={handleLogoDelete}
                      disabled={isUploading}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 shadow-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete & Reset to Text Logo
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-mono truncate max-w-full">{settings.brand_logo_image_url}</p>
                </div>
              ) : (
                <div className="mb-4 rounded-xl bg-slate-100 p-4 text-center text-xs text-slate-400 font-bold">
                  Using default text/letter logo: <span className="text-rose-500">"{settings.brand_logo_text || "A"}"</span>
                </div>
              )}

              {/* Upload Logo area */}
              <label className={`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isUploading ? "border-rose-300 bg-rose-50" : "border-slate-300 hover:border-rose-400 hover:bg-rose-50/40"}`}>
                <Upload className={`w-8 h-8 ${isUploading ? "text-rose-500 animate-bounce" : "text-slate-400"}`} />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">{isUploading ? "Working..." : "Click to upload new logo image"}</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, SVG, WEBP supported (transparent background is best)</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={isUploading} />
              </label>

              {settings.brand_logo_image_url && (
                <button
                  onClick={handleLogoDelete}
                  disabled={isUploading}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-400 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Custom Logo &amp; Reset to Text Logo
                </button>
              )}
            </SectionCard>

            <SectionCard title="E-Passport Page Cover Image">
              <p className="text-xs text-slate-500 mb-4">Upload a custom cover image for the E-Passport Page. Recommended: 1920×1080px or similar wide-format image.</p>

              {/* Dynamic Device Preview Toggle */}
              {(settings.passport_cover_image_url || true) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 max-w-xs">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Device View Mock:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setPassportPreviewMode("desktop")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${passportPreviewMode === "desktop" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
                      >
                        Desktop
                      </button>
                      <button
                        onClick={() => setPassportPreviewMode("mobile")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${passportPreviewMode === "mobile" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>

                  <div className={`rounded-2xl overflow-hidden border border-slate-200 relative group bg-slate-950 shadow-inner transition-all duration-300 ${passportPreviewMode === "desktop" ? "aspect-[21/9] w-full" : "aspect-[9/16] w-[260px] mx-auto"
                    }`}>
                    <img src={settings.passport_cover_image_url || "/epassport_cover.png"} alt="Passport cover" className="w-full h-full object-cover object-center opacity-60" />

                    {/* Safe zone indicator grid */}
                    <div className="absolute inset-4 border border-white/20 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                      <span className="text-[8px] text-white/40 font-mono tracking-widest uppercase">Safe Zone Grid</span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-white font-mono text-[8px] font-black uppercase tracking-wider mb-2">Live Web Banner View</span>
                      <h1 className={`${passportPreviewMode === "desktop" ? "text-sm md:text-lg" : "text-xs"} font-black text-white leading-tight drop-shadow-md`}>{settings.epassport_page_title || "ই-পাসপোর্ট আবেদন"}</h1>
                      <p className={`${passportPreviewMode === "desktop" ? "text-[8px]" : "text-[6px]"} text-slate-300 font-medium drop-shadow-sm mt-1 max-w-[180px] mx-auto`}>
                        {passportPreviewMode === "desktop" ? "Passport Background Banner (Centered Crop)" : "Mobile Tall Crop"}
                      </p>
                    </div>
                    {settings.passport_cover_image_url && (
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all flex items-center justify-center">
                        <button
                          onClick={handlePassportCoverDelete}
                          disabled={isUploading}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 shadow-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete & Reset to Default
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload area */}
              <label className={`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isUploading ? "border-rose-300 bg-rose-50" : "border-slate-300 hover:border-rose-400 hover:bg-rose-50/40"}`}>
                <Upload className={`w-8 h-8 ${isUploading ? "text-rose-500 animate-bounce" : "text-slate-400"}`} />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">{isUploading ? "Working..." : "Click to upload new cover image"}</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP supported</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handlePassportCoverUpload} disabled={isUploading} />
              </label>

              {settings.passport_cover_image_url && (
                <button
                  onClick={handlePassportCoverDelete}
                  disabled={isUploading}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-400 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Custom Cover &amp; Reset to Default
                </button>
              )}
            </SectionCard>

            <SectionCard title="Visa Page Cover Image">
              <p className="text-xs text-slate-500 mb-4">Upload a custom cover image for the Visa Page. Recommended: 1920×1080px or similar wide-format image.</p>

              {/* Dynamic Device Preview Toggle */}
              {(settings.visa_cover_image_url || true) && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3 bg-slate-100 p-1.5 rounded-xl border border-slate-200/60 max-w-xs">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Device View Mock:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setVisaPreviewMode("desktop")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${visaPreviewMode === "desktop" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
                      >
                        Desktop
                      </button>
                      <button
                        onClick={() => setVisaPreviewMode("mobile")}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider ${visaPreviewMode === "mobile" ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-200"}`}
                      >
                        Mobile
                      </button>
                    </div>
                  </div>

                  <div className={`rounded-2xl overflow-hidden border border-slate-200 relative group bg-slate-950 shadow-inner transition-all duration-300 ${visaPreviewMode === "desktop" ? "aspect-[21/9] w-full" : "aspect-[9/16] w-[260px] mx-auto"
                    }`}>
                    <img src={settings.visa_cover_image_url || "/epassport_cover.png"} alt="Visa cover" className="w-full h-full object-cover object-center opacity-60" />

                    {/* Safe zone indicator grid */}
                    <div className="absolute inset-4 border border-white/20 border-dashed rounded-xl pointer-events-none flex items-center justify-center">
                      <span className="text-[8px] text-white/40 font-mono tracking-widest uppercase">Safe Zone Grid</span>
                    </div>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-t from-slate-950/80 via-slate-900/10 to-transparent pointer-events-none">
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/80 text-white font-mono text-[8px] font-black uppercase tracking-wider mb-2">Live Web Banner View</span>
                      <h1 className={`${visaPreviewMode === "desktop" ? "text-sm md:text-lg" : "text-xs"} font-black text-white leading-tight drop-shadow-md`}>{settings.visa_page_title || "ভিসা আবেদন"}</h1>
                      <p className={`${visaPreviewMode === "desktop" ? "text-[8px]" : "text-[6px]"} text-slate-300 font-medium drop-shadow-sm mt-1 max-w-[180px] mx-auto`}>
                        {visaPreviewMode === "desktop" ? "Visa Background Banner (Centered Crop)" : "Mobile Tall Crop"}
                      </p>
                    </div>
                    {settings.visa_cover_image_url && (
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/60 transition-all flex items-center justify-center">
                        <button
                          onClick={handleVisaCoverDelete}
                          disabled={isUploading}
                          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-xl hover:bg-red-600 shadow-lg cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete & Reset to Default
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Upload area */}
              <label className={`flex flex-col items-center gap-3 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isUploading ? "border-rose-300 bg-rose-50" : "border-slate-300 hover:border-rose-400 hover:bg-rose-50/40"}`}>
                <Upload className={`w-8 h-8 ${isUploading ? "text-rose-500 animate-bounce" : "text-slate-400"}`} />
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-700">{isUploading ? "Working..." : "Click to upload new cover image"}</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WEBP supported</p>
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={handleVisaCoverUpload} disabled={isUploading} />
              </label>

              {settings.visa_cover_image_url && (
                <button
                  onClick={handleVisaCoverDelete}
                  disabled={isUploading}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-red-200 text-red-500 text-xs font-bold rounded-xl hover:bg-red-50 hover:border-red-400 transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Custom Cover &amp; Reset to Default
                </button>
              )}
            </SectionCard>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

// Touched to refresh IDE language server cache


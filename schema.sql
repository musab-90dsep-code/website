-- 1. Create tables
CREATE TABLE IF NOT EXISTS public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  label text,
  group_name text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  requirement text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  order_num integer NOT NULL DEFAULT 0,
  type text NOT NULL DEFAULT 'trading',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  location text NOT NULL,
  avatar_letter text NOT NULL,
  color_class text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  review_text text NOT NULL,
  service_received text NOT NULL,
  avatar_image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.feature_cards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon_name text NOT NULL,
  color text NOT NULL,
  order_num integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.epassport_requirements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  desc_text text NOT NULL,
  icon_name text NOT NULL,
  color text NOT NULL,
  order_num integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.visa_countries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  desc_text text NOT NULL,
  icon_bg text NOT NULL,
  icon_color text NOT NULL,
  order_num integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.epassport_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visa_countries ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies (allow anon/public operations)
-- site_settings
DROP POLICY IF EXISTS "Allow public read access to site_settings" ON public.site_settings;
CREATE POLICY "Allow public read access to site_settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access to site_settings" ON public.site_settings;
CREATE POLICY "Allow public write access to site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- leads
DROP POLICY IF EXISTS "Allow public read access to leads" ON public.leads;
CREATE POLICY "Allow public read access to leads" ON public.leads FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access to leads" ON public.leads;
CREATE POLICY "Allow public write access to leads" ON public.leads FOR ALL USING (true) WITH CHECK (true);

-- services
DROP POLICY IF EXISTS "Allow public read access to services" ON public.services;
CREATE POLICY "Allow public read access to services" ON public.services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access to services" ON public.services;
CREATE POLICY "Allow public write access to services" ON public.services FOR ALL USING (true) WITH CHECK (true);

-- reviews
DROP POLICY IF EXISTS "Allow public read access to reviews" ON public.reviews;
CREATE POLICY "Allow public read access to reviews" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access to reviews" ON public.reviews;
CREATE POLICY "Allow public write access to reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- feature_cards
DROP POLICY IF EXISTS "Allow public read access to feature_cards" ON public.feature_cards;
CREATE POLICY "Allow public read access to feature_cards" ON public.feature_cards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access to feature_cards" ON public.feature_cards;
CREATE POLICY "Allow public write access to feature_cards" ON public.feature_cards FOR ALL USING (true) WITH CHECK (true);

-- epassport_requirements
DROP POLICY IF EXISTS "Allow public read access to epassport_requirements" ON public.epassport_requirements;
CREATE POLICY "Allow public read access to epassport_requirements" ON public.epassport_requirements FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access to epassport_requirements" ON public.epassport_requirements;
CREATE POLICY "Allow public write access to epassport_requirements" ON public.epassport_requirements FOR ALL USING (true) WITH CHECK (true);

-- visa_countries
DROP POLICY IF EXISTS "Allow public read access to visa_countries" ON public.visa_countries;
CREATE POLICY "Allow public read access to visa_countries" ON public.visa_countries FOR SELECT USING (true);
DROP POLICY IF EXISTS "Allow public write access to visa_countries" ON public.visa_countries;
CREATE POLICY "Allow public write access to visa_countries" ON public.visa_countries FOR ALL USING (true) WITH CHECK (true);

-- 4. Seed initial/default data
-- site_settings
INSERT INTO public.site_settings (key, value, label, group_name) VALUES
('footer_company_name', 'AL NAZIM TRAVELS CONSULTANCY', 'Company Name', 'footer'),
('footer_copyright', 'Copyright © 2026 Al Nazim Travels. Designed to exceed expectations.', 'Copyright', 'footer'),
('social_facebook', 'https://facebook.com', 'Facebook Link', 'footer'),
('social_twitter', 'https://x.com', 'Twitter Link', 'footer'),
('social_instagram', 'https://instagram.com', 'Instagram Link', 'footer'),
('social_linkedin', 'https://linkedin.com', 'LinkedIn Link', 'footer'),
('social_youtube', 'https://youtube.com', 'YouTube Link', 'footer'),
('brand_name', 'Al Nazim', 'Brand Name', 'brand'),
('brand_sub', 'Travels', 'Brand Subtitle', 'brand'),
('brand_logo_text', 'A', 'Brand Logo Initials', 'brand'),
('hero_badge_text', 'Premium Business & Investment Partner', 'Hero Badge Text', 'hero'),
('hero_title_line1', 'SAUDI INVESTMENT', 'Hero Title Line 1', 'hero'),
('hero_title_line2', 'LANDING & CONTRACTING HUB', 'Hero Title Line 2', 'hero'),
('hero_location', 'JEDDAH, SAUDI ARABIA', 'Hero Location', 'hero'),
('hero_tagline', 'Your trusted partner for premium corporate setup, investor licensing, fast e-passports, and comprehensive visa services.', 'Hero Tagline', 'hero'),
('hero_cta_button', 'GET STARTED NOW', 'Hero CTA Button', 'hero'),
('why_choose_title', 'WHY CHOOSE AL NAZIM TRAVELS?', 'Why Choose Title', 'about'),
('why_choose_para1', 'We are a registered travel agency and business consultancy based in Jeddah, Saudi Arabia. With years of experience, we provide end-to-end guidance for business formation, visa processing, and e-passport applications.', 'Why Choose Para 1', 'about'),
('why_choose_para2', 'Our dedicated team ensures absolute transparency, fast turnaround times, and direct liaison with government ministries.', 'Why Choose Para 2', 'about'),
('services_section_title', 'Our Services', 'Services Title', 'services'),
('services_section_subtitle', 'Providing reliable E-Passport & Visa application services', 'Services Subtitle', 'services'),
('testimonials_section_title', 'HAPPY CLIENTS', 'Testimonials Title', 'testimonials'),
('testimonials_section_subtitle', 'Don''t just take our word for it. See what our valued clients have to say about our fast, reliable, and professional services.', 'Testimonials Subtitle', 'testimonials'),
('contact_phone', '+966 500 000 000', 'Contact Phone', 'contact'),
('contact_email', 'info@alnazimtravels.com', 'Contact Email', 'contact'),
('contact_address', 'King Abdullah Rd, Jeddah, Saudi Arabia', 'Contact Address', 'contact'),
('contact_whatsapp', '+966500000000', 'WhatsApp Contact', 'contact'),
('email_notification_key', '', 'Web3Forms Access Key', 'contact'),
('wheel1_winner_line1', 'Free Name', 'Wheel 1 Winner Line 1', 'spinning'),
('wheel1_winner_line2', 'Clearance', 'Wheel 1 Winner Line 2', 'spinning'),
('wheel2_winner_line1', 'Free Name', 'Wheel 2 Winner Line 1', 'spinning'),
('wheel2_winner_line2', 'Clearance', 'Wheel 2 Winner Line 2', 'spinning')
ON CONFLICT (key) DO NOTHING;

-- services
INSERT INTO public.services (name, order_num, type) VALUES
('Mother Company Setup', 1, 'trading'),
('Name Clearance', 2, 'trading'),
('Investment Licences (MISA)', 3, 'trading'),
('SBC Approved', 4, 'trading'),
('Commercial Registration (CR)', 5, 'trading'),
('Muqeem Portal Registration', 6, 'trading'),
('Qiwa Portal Registration', 7, 'trading'),
('Chamber of Commerce', 8, 'trading'),
('VAT / Zakat Registration', 1, 'service'),
('National Address (SPL)', 2, 'service'),
('Business Bank Account', 3, 'service'),
('Mudad Account Registration', 4, 'service')
ON CONFLICT DO NOTHING;

-- reviews
INSERT INTO public.reviews (name, location, avatar_letter, color_class, rating, review_text, service_received) VALUES
('Ahmed Hassan', 'Saudi Arabia', 'AH', 'bg-indigo-500', 5, 'The E-Passport application process was incredibly smooth. They guided me through every step, and I received my passport much faster than expected. Highly recommended!', 'E-Passport Application'),
('Sarah Malik', 'United Arab Emirates', 'SM', 'bg-rose-500', 5, 'I needed a business visa urgently, and the team handled everything flawlessly. Professional, transparent pricing, and excellent communication throughout.', 'Visa Application'),
('Rayan Al-Saud', 'Qatar', 'RA', 'bg-teal-500', 5, 'Outstanding service! From document preparation to the final submission, they took care of all the headaches. I will definitely use their services again.', 'Business Consultancy')
ON CONFLICT DO NOTHING;

-- feature_cards
INSERT INTO public.feature_cards (title, description, icon_name, color, order_num) VALUES
('Fast Document Clearing', 'We handle government clearance in record time, from commercial registration to MISA licenses.', 'FileText', 'rose', 1),
('Certified Translation', 'Official translation of documents accepted by all Saudi ministries, embassies, and authorities.', 'Award', 'orange', 2),
('Affordable & Transparent Pricing', 'No hidden costs — just fair, upfront pricing for all our visa, e-passport, and consultancy services.', 'DollarSign', 'teal', 3)
ON CONFLICT DO NOTHING;

-- visa_countries
INSERT INTO public.visa_countries (name, type, desc_text, icon_bg, icon_color, order_num) VALUES
('সৌদি আরব', 'কাজের, উমরাহ এবং ভিজিট ভিসা', 'আমাদের মাধ্যমে দ্রুত এবং বিশ্বস্ততার সাথে আপনার সৌদি ভিসা প্রসেস করুন। উমরাহ, বিজনেস এবং কাজের ভিসার জন্য সম্পূর্ণ গাইডলাইন ও সহায়তা প্রদান করা হয়।', 'bg-emerald-100', 'text-emerald-600', 1),
('সংযুক্ত আরব আমিরাত (ইউএই)', 'ট্যুরিস্ট এবং বিজনেস ভিসা', 'দুবাই এবং সংযুক্ত আরব আমিরাতের ভিসা প্রসেসিং দ্রুততম সময়ে করুন। ট্যুরিস্ট, ট্রানজিট এবং বিজনেস ভ্রমণকারীদের জন্য আদর্শ সার্ভিস।', 'bg-blue-100', 'text-blue-600', 2),
('কাতার', 'ভিজিট এবং কাজের ভিসা', 'ঝামেলামুক্ত কাতার ভিসা প্রসেসিং সেবা, যার মধ্যে প্রয়োজনীয় কাগজপত্র সত্যায়ন এবং যথাযথ আবেদন সাবমিশন অন্তর্ভুক্ত রয়েছে।', 'bg-purple-100', 'text-purple-600', 3),
('ওমান', 'চাকরি এবং ভিজিট ভিসা', 'ওমান ভিসার আবেদনের জন্য নিখুঁত প্রফেশনাল সাপোর্ট। আপনার সব প্রয়োজনীয় ডকুমেন্ট সঠিক সময়ে প্রস্তুত করার নিশ্চয়তা।', 'bg-rose-100', 'text-rose-600', 4),
('ইউরোপ (সেনজেন)', 'ট্যুরিস্ট এবং স্টুডেন্ট ভিসা', 'ইউরোপ সেনজেন ভিসার জন্য সম্পূর্ণ প্রফেশনাল গাইডলাইন। ভ্রমণ পরিকল্পনা সাজানো, ট্রাভেল ইন্সুরেন্স এবং ফাইল প্রিপারেশনে সাহায্য করা হবে।', 'bg-indigo-100', 'text-indigo-600', 5),
('মালয়েশিয়া', 'ট্যুরিস্ট এবং মেডিকেল ভিসা', 'সর্বনিম্ন কাগজপত্রের মাধ্যমে খুব সহজেই মালয়েশিয়ান ই-ভিসা এবং স্টিকার ভিসা প্রসেসিংয়ের নির্ভরযোগ্য সেবা।', 'bg-amber-100', 'text-amber-600', 6)
ON CONFLICT DO NOTHING;

-- epassport_requirements
INSERT INTO public.epassport_requirements (title, desc_text, icon_name, color, order_num) VALUES
('জাতীয় পরিচয়পত্র (NID)', 'আপনার বৈধ জাতীয় পরিচয়পত্রের একটি স্পষ্ট ফটোকপি অথবা অনলাইন যাচাইকৃত জন্ম নিবন্ধন সনদ।', 'UserCheck', 'blue', 1),
('পূর্ববর্তী পাসপোর্ট', 'আপনার বিদ্যমান/পুরাতন পাসপোর্টের তথ্য পাতার কপি (যদি নবায়ন বা আপগ্রেডের জন্য আবেদন করেন)।', 'FileText', 'emerald', 2),
('পেশার প্রমাণপত্র', 'ইকামা/ভিসার কপি (প্রবাসীদের জন্য), এমপ্লয়ি আইডি কার্ড, অথবা আপনার উল্লেখিত পেশার স্বপক্ষে প্রমাণপত্র।', 'UploadCloud', 'rose', 3),
('আবেদনপত্র (Form)', 'পূরণকৃত এবং প্রিন্ট করা ই-পাসপোর্ট আবেদন সামারি। এটি সঠিকভাবে পূরণ করতে আমরা আপনাকে সাহায্য করব।', 'CheckCircle2', 'purple', 4)
ON CONFLICT DO NOTHING;

-- 5. Storage Buckets (Create 'images' bucket if not exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable storage RLS & Policies
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public select" ON storage.objects;
CREATE POLICY "Allow public select" ON storage.objects FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow public insert" ON storage.objects;
CREATE POLICY "Allow public insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow public update" ON storage.objects;
CREATE POLICY "Allow public update" ON storage.objects FOR UPDATE USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;
CREATE POLICY "Allow public delete" ON storage.objects FOR DELETE USING (bucket_id = 'images');

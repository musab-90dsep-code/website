-- Create visa_countries table
CREATE TABLE IF NOT EXISTS visa_countries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL,
  desc_text text NOT NULL,
  icon_bg text NOT NULL,
  icon_color text NOT NULL,
  order_num integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert fallback data for visa_countries
INSERT INTO visa_countries (name, type, desc_text, icon_bg, icon_color, order_num) VALUES
('সৌদি আরব', 'কাজের, উমরাহ এবং ভিজিট ভিসা', 'আমাদের মাধ্যমে দ্রুত এবং বিশ্বস্ততার সাথে আপনার সৌদি ভিসা প্রসেস করুন। উমরাহ, বিজনেস এবং কাজের ভিসার জন্য সম্পূর্ণ গাইডলাইন ও সহায়তা প্রদান করা হয়।', 'bg-emerald-100', 'text-emerald-600', 1),
('সংযুক্ত আরব আমিরাত (ইউএই)', 'ট্যুরিস্ট এবং বিজনেস ভিসা', 'দুবাই এবং সংযুক্ত আরব আমিরাতের ভিসা প্রসেসিং দ্রুততম সময়ে করুন। ট্যুরিস্ট, ট্রানজিট এবং বিজনেস ভ্রমণকারীদের জন্য আদর্শ সার্ভিস।', 'bg-blue-100', 'text-blue-600', 2),
('কাতার', 'ভিজিট এবং কাজের ভিসা', 'ঝামেলামুক্ত কাতার ভিসা প্রসেসিং সেবা, যার মধ্যে প্রয়োজনীয় কাগজপত্র সত্যায়ন এবং যথাযথ আবেদন সাবমিশন অন্তর্ভুক্ত রয়েছে।', 'bg-purple-100', 'text-purple-600', 3),
('ওমান', 'চাকরি এবং ভিজিট ভিসা', 'ওমান ভিসার আবেদনের জন্য নিখুঁত প্রফেশনাল সাপোর্ট। আপনার সব প্রয়োজনীয় ডকুমেন্ট সঠিক সময়ে প্রস্তুত করার নিশ্চয়তা।', 'bg-rose-100', 'text-rose-600', 4),
('ইউরোপ (সেনজেন)', 'ট্যুরিস্ট এবং স্টুডেন্ট ভিসা', 'ইউরোপ সেনজেন ভিসার জন্য সম্পূর্ণ প্রফেশনাল গাইডলাইন। ভ্রমণ পরিকল্পনা সাজানো, ট্রাভেল ইন্সুরেন্স এবং ফাইল প্রিপারেশনে সাহায্য করা হবে।', 'bg-indigo-100', 'text-indigo-600', 5),
('মালয়েশিয়া', 'ট্যুরিস্ট এবং মেডিকেল ভিসা', 'সর্বনিম্ন কাগজপত্রের মাধ্যমে খুব সহজেই মালয়েশিয়ান ই-ভিসা এবং স্টিকার ভিসা প্রসেসিংয়ের নির্ভরযোগ্য সেবা।', 'bg-amber-100', 'text-amber-600', 6);


-- Create epassport_requirements table
CREATE TABLE IF NOT EXISTS epassport_requirements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  desc_text text NOT NULL,
  icon_name text NOT NULL,
  color text NOT NULL,
  order_num integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert fallback data for epassport_requirements
INSERT INTO epassport_requirements (title, desc_text, icon_name, color, order_num) VALUES
('জাতীয় পরিচয়পত্র (NID)', 'আপনার বৈধ জাতীয় পরিচয়পত্রের একটি স্পষ্ট ফটোকপি অথবা অনলাইন যাচাইকৃত জন্ম নিবন্ধন সনদ।', 'UserCheck', 'blue', 1),
('পূর্ববর্তী পাসপোর্ট', 'আপনার বিদ্যমান/পুরাতন পাসপোর্টের তথ্য পাতার কপি (যদি নবায়ন বা আপগ্রেডের জন্য আবেদন করেন)।', 'FileText', 'emerald', 2),
('পেশার প্রমাণপত্র', 'ইকামা/ভিসার কপি (প্রবাসীদের জন্য), এমপ্লয়ি আইডি কার্ড, অথবা আপনার উল্লেখিত পেশার স্বপক্ষে প্রমাণপত্র।', 'UploadCloud', 'rose', 3),
('আবেদনপত্র (Form)', 'পূরণকৃত এবং প্রিন্ট করা ই-পাসপোর্ট আবেদন সামারি। এটি সঠিকভাবে পূরণ করতে আমরা আপনাকে সাহায্য করব।', 'CheckCircle2', 'purple', 4);

-- Set permissions (Allow anonymous access)
ALTER TABLE visa_countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE epassport_requirements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to visa_countries" ON visa_countries FOR SELECT USING (true);
CREATE POLICY "Allow anon insert to visa_countries" ON visa_countries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update to visa_countries" ON visa_countries FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete to visa_countries" ON visa_countries FOR DELETE USING (true);

CREATE POLICY "Allow public read access to epassport_requirements" ON epassport_requirements FOR SELECT USING (true);
CREATE POLICY "Allow anon insert to epassport_requirements" ON epassport_requirements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update to epassport_requirements" ON epassport_requirements FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Allow anon delete to epassport_requirements" ON epassport_requirements FOR DELETE USING (true);

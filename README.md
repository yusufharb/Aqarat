# عقار إكزت | Aqar Exit

> منصة رقمية لتسهيل التنازل عن وحدات التقسيط العقاري في مصر - بدون أوفر

## نظرة عامة

منصة عقار إكزت تربط بين أصحاب الوحدات العقارية الراغبين في التنازل (سواء لظروف مالية أو لأسباب استثمارية) والمشترين الباحثين عن فرص بسعر التعاقد القديم.

## التقنيات المستخدمة

- **Frontend:** Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- **Backend:** Next.js API Routes + Server Actions
- **Database:** PostgreSQL via Supabase (with Row Level Security)
- **Auth:** Supabase Auth
- **Storage:** Supabase Private Storage (for sensitive documents)
- **Language:** Arabic (RTL layout)

## أوضاع التشغيل

المنصة تدعم ثلاثة أوضاع تشغيل منفصلة:

| الوضع | الوصف | يحتاج Supabase؟ |
|---|---|---|
| `demo` | بيانات وهمية في الذاكرة للمعاينة والتطوير المحلي | ❌ لا |
| `development` | متصل بمشروع Supabase للتطوير | ✅ نعم |
| `production` | متصل بمشروع Supabase للإنتاج | ✅ نعم |

> ⚠️ **تنبيه أمني:** لا يتم الرجوع تلقائياً إلى وضع Demo عند فشل الاتصال بقاعدة البيانات. إذا كان `APP_MODE=production` ولم تتوفر مفاتيح Supabase، سيتوقف التطبيق بخطأ واضح.

## التشغيل المحلي

### المتطلبات
- Node.js >= 18
- npm >= 9

### الخطوات

```bash
# 1. استنسخ المشروع
git clone <repo-url>
cd Aqarat

# 2. ثبّت الحزم
npm install

# 3. أنشئ ملف البيئة المحلي
cp .env.example .env.local
# (الافتراضي: APP_MODE=demo - لا يحتاج أي إعداد إضافي)

# 4. شغّل خادم التطوير
npm run dev

# 5. افتح المتصفح على http://localhost:3000
```

### التشغيل مع Supabase

```bash
# في .env.local:
APP_MODE=development
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # خادم فقط
```

## هيكل المشروع

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (RTL, Cairo font)
│   ├── page.tsx            # Home page
│   └── globals.css         # Tailwind + brand theme
├── lib/
│   ├── types.ts            # TypeScript types and enums
│   ├── env.ts              # Server-only environment config
│   ├── utils.ts            # Formatting and utility functions
│   └── data/
│       ├── repository.ts   # Data access interface
│       ├── demo-data.ts    # Fictional demo data
│       ├── demo-repository.ts  # Demo implementation
│       └── index.ts        # Repository factory
supabase/
│   └── migrations/         # PostgreSQL migration files (Phase B)
```

## الأمان

- ❌ لا يتم تمرير `SUPABASE_SERVICE_ROLE_KEY` للمتصفح أبداً
- ❌ لا تعرض البيانات الشخصية للبائع في الكتالوج العام
- ✅ الصلاحيات مطبقة على الخادم وقاعدة البيانات (RLS)
- ✅ المستندات مخزنة في Private Bucket بروابط مؤقتة
- ✅ سجل التدقيق محمي من التعديل والحذف عبر التطبيق
- ⚠️ حماية سجل التدقيق لا تمنع مسؤول قاعدة البيانات ذي الصلاحيات المرتفعة

## الترخيص

خاص - جميع الحقوق محفوظة

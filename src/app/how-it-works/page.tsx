import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-black text-surface-900 mb-3">
              كيف تعمل منصة عقار سواب؟
            </h1>
            <p className="text-surface-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              دليلك الشامل لفهم الإجراءات القانونية والمالية لنقل ملكية وحدات التقسيط بدون أوفر في مصر.
            </p>
          </div>

          <div className="space-y-12">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 font-black text-xl flex items-center justify-center shrink-0">
                ١
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-surface-900">
                  فحص العقد والموقف المالي لدى المطور
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                  يقوم المالك (البائع) برفع صورة العقد وكشف حساب الأقساط الأخير. يقوم الفريق المالي والتدقيق لدينا بفحص المبالغ المسددة، والأقساط المتبقية، والتأكد من مطابقة شروط التنازل مع سياسة المطور العقاري (مثل سداد نسبة محددة من ثمن الوحدة كشرط لفتح التنازل).
                </p>
                <div className="bg-surface-50 p-3.5 rounded-xl border border-surface-200 text-xs text-surface-700">
                  📌 <strong>ملاحظة هامة:</strong> المنصة تدعم نوعين من الطلبات: وحدات عادية ووحدات تعثر مالي وتخارج (حيث تتم معالجة بيانات المتأخرات والإنذارات بسرية تامة ولا تظهر للمشترين).
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 font-black text-xl flex items-center justify-center shrink-0">
                ٢
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-surface-900">
                  بوابات النشر الـ 9 والاعتماد الخادمي
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                  لا يتم نشر أي وحدة للعامة إلا بعد اجتياز 9 بوابات تحقق صارمة: اكتمال البيانات، تأكيد هوية البائع ببطاقة الرقم القومي، التحقق من مستندات السداد، اعتماد المراجعة المالية، قرار المراجعة القانونية الإيجابي، وضوح موقف المطور من التنازل، اعتماد مسؤول النشر، تنقية الإعلان من البيانات الشخصية، وإظهار تاريخ آخر تحقق.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 font-black text-xl flex items-center justify-center shrink-0">
                ٣
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-surface-900">
                  مطابقة المشتري الجاد والتأهيل المالي
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                  عند تقديم المشتري لطلب اهتمام بالوحدة، يتم التأكد من قدرته على سداد المبلغ المطلوب كاش للبائع، وقدرته المالية على استكمال الأقساط الدورية المقررة مع المطور في مواعيدها لتجنب أي تعثر لاحق.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-3xl p-8 border border-surface-200 shadow-xs flex flex-col md:flex-row gap-6 items-start">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 font-black text-xl flex items-center justify-center shrink-0">
                ٤
              </div>
              <div className="space-y-3 flex-1">
                <h3 className="text-xl font-bold text-surface-900">
                  إتمام التنازل الرسمي ونقل الملكية بمقر المطور
                </h3>
                <p className="text-xs sm:text-sm text-surface-600 leading-relaxed">
                  يتم التنسيق لتحديد موعد رسمي بإدارة خدمة العملاء بمقر المطور العقاري. يحضر البائع والمشتري بشخصيهما (أو بتوكيل رسمي خاص محدد للغرض)، ويتم سداد رسوم التنازل إن وجدت، واستلام البائع لأمواله كاش، وتوقيع ملحق التنازل الرسمي واعتماده من الشركة المطورة.
                </p>
                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-medium">
                  ✓ النتيجة: البائع تخلص من عبء الأقساط واسترد مدخراته بدون غرامات فسخ، والمشتري حصل على الوحدة بسعر التعاقد القديم بدون أي أوفر برايس!
                </div>
              </div>
            </div>
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/seller/new-case"
              className="inline-flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-bold px-8 py-4 rounded-2xl shadow-md transition-all"
            >
              <span>سجل وحدتك الآن وابدأ التخارج الآمن</span>
              <span>←</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import Link from 'next/link';

export function HowItWorksTimeline() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-black text-surface-900 mb-3">
            رحلة التنازل خطوة بخطوة
          </h2>
          <p className="text-surface-600 text-sm sm:text-base">
            إجراءات واضحة ومنظمة تضمن الأمان التام لكل من البائع والمشتري تحت إشراف المطور الرسمي.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Seller Flow */}
          <div className="bg-surface-50 rounded-3xl p-8 border border-surface-200">
            <div className="inline-flex items-center gap-2 bg-brand-700 text-white text-xs font-bold px-3.5 py-1 rounded-full mb-6">
              مسار البائع (صاحب الوحدة)
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-black flex items-center justify-center shrink-0">
                  ١
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">تسجيل الوحدة والعقد</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    إدخال بيانات المشروع، المطور، المبالغ المدفوعة، والمتبقي بدقة، وتحديد ما إذا كان التنازل عادياً أم بدافع التعثر المالي.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-black flex items-center justify-center shrink-0">
                  ٢
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">رفع المستندات الخاصة</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    رفع صورة العقد، إيصالات السداد، وبطاقة الرقم القومي إلى الخزينة الآمنة المشفرة لمراجعتها داخلياً دون نشرها للعامة.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-black flex items-center justify-center shrink-0">
                  ٣
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">المراجعة والتحقق (بوابات النشر الـ 9)</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    فحص مالي وقانوني شامل للتأكد من مطابقة الأرقام لكشف حساب المطور وسلامة موقف التنازل قبل الاعتماد.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-800 font-black flex items-center justify-center shrink-0">
                  ٤
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">المطابقة والتنازل بمقر المطور</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    إيصالك بمشترٍ جاد ومؤهل مالياً، وحضور ممثل المنصة إجراءات توقيع التنازل الرسمي بخدمة عملاء المطور واستلام مستحقاتك كاش.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-200">
              <Link
                href="/seller/new-case"
                className="text-xs font-bold text-brand-800 hover:text-brand-900 flex items-center gap-1"
              >
                <span>ابدأ الآن بإنشاء مسودة طلب تنازل</span>
                <span>←</span>
              </Link>
            </div>
          </div>

          {/* Buyer Flow */}
          <div className="bg-surface-50 rounded-3xl p-8 border border-surface-200">
            <div className="inline-flex items-center gap-2 bg-surface-800 text-white text-xs font-bold px-3.5 py-1 rounded-full mb-6">
              مسار المشتري (الباحث عن فرصة)
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-200 text-surface-800 font-black flex items-center justify-center shrink-0">
                  ١
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">استعراض الفرص المعتمدة</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    تصفح الكتالوج المعتمد بعد اجتياز بوابات النشر، والاطلاع على تفصيل المبالغ المطلوبة كاش وجدول الأقساط المتبقية للمطور.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-200 text-surface-800 font-black flex items-center justify-center shrink-0">
                  ٢
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">فحص الأرقام الموثقة</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    التأكد من تاريخ آخر مراجعة مالية وقانونية، ومطابقة سعر التعاقد القديم الأصلي بدون إضافة أي أوفر برايس أو هوامش سماسرة.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-200 text-surface-800 font-black flex items-center justify-center shrink-0">
                  ٣
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">تقديم الاهتمام والتأهيل المالي</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    إرسال طلب اهتمام بالوحدة، والتأكد من ملاءمة الميزانية النقدية المتاحة وقيمة القسط المريح لاستكمال الأقساط مع المطور.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-surface-200 text-surface-800 font-black flex items-center justify-center shrink-0">
                  ٤
                </div>
                <div>
                  <h4 className="font-bold text-surface-900 mb-1">نقل الملكية واستلام العقد المعتمد</h4>
                  <p className="text-xs text-surface-600 leading-relaxed">
                    توقيع ملحق التنازل الرسمي بمقر المطور العقاري، ونقل ملف الوحدة باسمك واستكمال الأقساط المتبقية مباشرة مع شركة التطوير.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-surface-200">
              <Link
                href="/units"
                className="text-xs font-bold text-surface-800 hover:text-surface-900 flex items-center gap-1"
              >
                <span>تصفح أحدث الفرص العقارية المتاحة</span>
                <span>←</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

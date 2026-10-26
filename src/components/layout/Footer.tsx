import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300 pt-16 pb-12 border-t border-surface-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl">
                ع
              </div>
              <span className="text-2xl font-black text-white">عقار إكزت</span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-md">
              المنصة المتخصصة الأولى في مصر لإدارة وتوثيق عمليات التنازل عن وحدات التقسيط العقاري بدون أوفر. نوفر مخرجاً آمناً للمتعثرين والراغبين في التخارج وفرصاً حقيقية للمشترين بأسعار التعاقد القديمة.
            </p>
            <div className="pt-2 text-xs text-brand-400 font-semibold">
              ✓ إطلاق تجريبي مجاني بالكامل - 0% عمولة على البائع والمشتري
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-base font-bold mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/units" className="hover:text-brand-400 transition-colors">
                  تصفح الوحدات المعتمدة
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="hover:text-brand-400 transition-colors">
                  حاسبة التنازل ومقارنة الإلغاء
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand-400 transition-colors">
                  كيف تعمل المنصة
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-400 transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/seller/new-case" className="hover:text-brand-400 transition-colors">
                  طلب تنازل جديد (للبائع)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Disclaimer */}
          <div>
            <h4 className="text-white text-base font-bold mb-4">الضمانات والرقابة</h4>
            <ul className="space-y-2.5 text-sm text-surface-400">
              <li>• مراجعة قانونية وفحص مستندات</li>
              <li>• مراجعة مالية معتمدة لكشوف الحساب</li>
              <li>• إجراءات التنازل بمقر المطور الرسمي</li>
              <li>• خصوصية تامة وعدم نشر بيانات البائع</li>
              <li>• سجل تدقيق ومساءلة غير قابل للتعديل</li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="bg-surface-800/80 rounded-2xl p-5 mb-8 border border-surface-700/60 text-xs leading-relaxed text-surface-400">
          <strong className="text-surface-200 block mb-1">إخلاء مسؤولية وتنبيه قانوني:</strong>
          منصة عقار إكزت هي منصة تقنية استشارية لتنظيم وتوثيق خطوات التنازل العقاري ولا تمثل جهة تمويل أو حساب ضمان بنكي (Escrow). المبالغ المعروضة تعتمد على العقود وإيصالات السداد وكشوف الحساب الصادرة عن المطورين في تاريخ المراجعة وقد تخضع للتغيير أو لتطبيق رسوم إدارية من المطور. التنازل الرسمي ونقل الملكية وسداد المبالغ يتم حصراً بالحضور الشخصي للطرفين أو وكلائهما الرسميين بمقر المطور العقاري المعتمد ووفق لوائحه المعتمدة.
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-surface-800 text-xs text-surface-500 gap-4">
          <p>© 2026 عقار إكزت (Aqar Exit). جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <span>تغطية تشمل جميع محافظات جمهورية مصر العربية</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

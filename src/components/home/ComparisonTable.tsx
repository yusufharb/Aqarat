export function ComparisonTable() {
  return (
    <section className="py-20 bg-surface-50 border-y border-surface-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-black text-surface-900 mb-3">
            لماذا تختار التنازل بدلاً من فسخ التعاقد؟
          </h2>
          <p className="text-surface-600 text-sm sm:text-base">
            مقارنة واضحة تكشف حجم الخسائر التي قد تتكبدها عند اللجوء للإلغاء مع المطور مقابل المخرج الآمن عبر التنازل المنظم.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-sm border border-surface-200 overflow-hidden text-right">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-100 text-xs font-bold text-surface-700">
                <th className="p-4 sm:p-5 w-1/4">وجه المقارنة</th>
                <th className="p-4 sm:p-5 w-1/3 bg-brand-50 text-brand-900 border-x-2 border-brand-500">
                  <span className="text-sm font-black block">التنازل عبر عقار إكزت</span>
                  <span className="text-[11px] font-normal text-brand-700">الخيار الأكثر حماية لأموالك</span>
                </th>
                <th className="p-4 sm:p-5 w-1/3 text-surface-700">
                  <span className="text-sm font-black block">فسخ التعاقد مع المطور</span>
                  <span className="text-[11px] font-normal text-surface-500">شروط الإلغاء والجزاءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 text-xs sm:text-sm">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">استرداد المبالغ المدفوعة</td>
                <td className="p-4 sm:p-5 bg-brand-50/50 text-brand-900 font-semibold border-x-2 border-brand-500">
                  استرداد المبالغ المتفق عليها كاش بالكامل فور توقيع التنازل بمقر المطور
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  خصم غرامات تتراوح بين 10% إلى 15% من إجمالي سعر الوحدة الأصلي
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">سرعة صرف الأموال</td>
                <td className="p-4 sm:p-5 bg-brand-50/50 text-brand-900 font-semibold border-x-2 border-brand-500">
                  فور إتمام التنازل وبحضور الطرفين
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  تأجيل صرف الشيكات من قبل المطور على دفعات متباعدة قد تمتد لسنوات
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">عمولة المنصة في الإطلاق</td>
                <td className="p-4 sm:p-5 bg-brand-50/50 text-brand-900 font-semibold border-x-2 border-brand-500">
                  0% مجاناً تماماً على البائع والمشتري
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  مصاريف إدارية وغرامات فسخ تعاقد باهظة
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">ميزة المشتري الجديد</td>
                <td className="p-4 sm:p-5 bg-brand-50/50 text-brand-900 font-semibold border-x-2 border-brand-500">
                  اقتناص الوحدة بسعر التعاقد القديم بدون أي أوفر برايس
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  المطور يعيد طرح الوحدة بأسعار السوق الحالية المرتفعة جداً
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">الضمان والتوثيق</td>
                <td className="p-4 sm:p-5 bg-brand-50/50 text-brand-900 font-semibold border-x-2 border-brand-500">
                  مراجعة قانونية ومالية مسبقة، ونقل رسمي معتمد في إدارة خدمة عملاء المطور
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  إجراءات استرداد روتينية معقدة وقد تنتهي بنزاعات
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

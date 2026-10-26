import React from 'react';
import { ShieldCheck, CheckCircle2, DollarSign, Clock, Users, Building } from 'lucide-react';

export function ComparisonTable() {
  const valueProps = [
    {
      title: '0% عمولة على البائع',
      desc: 'خدمة التنازل مجانية تماماً للبائع بدون أي استقطاع من مدخراته في فترة الإطلاق الأولي.',
      icon: <DollarSign className="w-5 h-5 text-emerald-700" />,
      bg: 'bg-emerald-50 border-emerald-200/80',
    },
    {
      title: 'سعر التعاقد القديم بدون أوفر',
      desc: 'يقتنص المشتري الوحدة بأسعار تعاقد المطور القديمة دون تحمل مبالغات السماسرة.',
      icon: <CheckCircle2 className="w-5 h-5 text-brand-700" />,
      bg: 'bg-brand-50 border-brand-200/80',
    },
    {
      title: 'تدقيق 9 بوابات مسبقاً',
      desc: 'فحص مالي وقانوني للعقد وموقف الأقساط قبل اعتماد وطرح أي وحدة بالكتالوج العام.',
      icon: <ShieldCheck className="w-5 h-5 text-blue-700" />,
      bg: 'bg-blue-50 border-blue-200/80',
    },
    {
      title: 'التنازل بمقر المطور الرسمي',
      desc: 'نقل التعاقد واستلام الأموال يتم حصراً بالحضور الشخصي للطرفين بإدارة خدمة العملاء.',
      icon: <Building className="w-5 h-5 text-purple-700" />,
      bg: 'bg-purple-50 border-purple-200/80',
    },
  ];

  return (
    <section className="py-20 bg-surface-50 border-y border-surface-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Cards Section (Matching Image 1: "ليه تختار نزل؟") */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-800 bg-brand-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
            معايير الأمان والشفافية
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-surface-900 mb-2">
            ليه تختار منصة عقار إكزت للتنازل؟
          </h2>
          <p className="text-surface-600 text-xs sm:text-sm">
            نظام متكامل يضمن حقوق البائع والمشتري تحت إشراف الشركات العقارية المطورة.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {valueProps.map((prop, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-2xl border ${prop.bg} shadow-2xs hover:shadow-xs transition-shadow`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-2xs">
                {prop.icon}
              </div>
              <h3 className="text-base font-bold text-surface-900 mb-1.5">{prop.title}</h3>
              <p className="text-xs text-surface-600 leading-relaxed">{prop.desc}</p>
            </div>
          ))}
        </div>

        {/* Detailed Comparison Table */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h3 className="text-xl sm:text-2xl font-black text-surface-900 mb-2">
            مقارنة رقمية: التنازل المنظم مقابل فسخ التعاقد
          </h3>
          <p className="text-surface-500 text-xs">
            الفرق الجوهري بين استرداد أموالك كاش وبين خسارة 15% من ثمن الوحدة الإجمالي.
          </p>
        </div>

        <div className="overflow-x-auto max-w-4xl mx-auto">
          <table className="w-full bg-white rounded-2xl shadow-xs border border-surface-200 overflow-hidden text-right">
            <thead>
              <tr className="border-b border-surface-200 bg-surface-100 text-xs font-bold text-surface-700">
                <th className="p-4 sm:p-5 w-1/4">وجه المقارنة</th>
                <th className="p-4 sm:p-5 w-1/3 bg-brand-50/80 text-brand-900 border-x-2 border-brand-600">
                  <span className="text-sm font-black block">التنازل عبر عقار إكزت</span>
                  <span className="text-[11px] font-normal text-brand-700">الخيار الأكثر أماناً لأموالك</span>
                </th>
                <th className="p-4 sm:p-5 w-1/3 text-surface-700">
                  <span className="text-sm font-black block">فسخ التعاقد مع المطور</span>
                  <span className="text-[11px] font-normal text-surface-500">شروط الإلغاء والجزاءات</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-200 text-xs">
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">استرداد المبالغ المدفوعة</td>
                <td className="p-4 sm:p-5 bg-brand-50/40 text-brand-950 font-bold border-x-2 border-brand-600">
                  استرداد المبالغ المتفق عليها كاش بالكامل فور توقيع ملحق التنازل
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  خصم غرامة إلغاء تتراوح بين 10% إلى 15% من إجمالي ثمن الوحدة كاملاً
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">سرعة صرف الأموال</td>
                <td className="p-4 sm:p-5 bg-brand-50/40 text-brand-950 font-bold border-x-2 border-brand-600">
                  فورية بمقر المطور بحضور الطرفين
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  تأجيل صرف الشيكات من قِبل المطور على دفعات مؤجلة قد تمتد لسنوات
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">عمولة المنصة في الإطلاق</td>
                <td className="p-4 sm:p-5 bg-brand-50/40 text-brand-950 font-bold border-x-2 border-brand-600">
                  0% مجاناً تماماً على البائع والمشتري
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  مصاريف إدارية وغرامات فسخ باهظة يفرضها المطور
                </td>
              </tr>
              <tr>
                <td className="p-4 sm:p-5 font-bold text-surface-800">ميزة المشتري الجديد</td>
                <td className="p-4 sm:p-5 bg-brand-50/40 text-brand-950 font-bold border-x-2 border-brand-600">
                  اقتناص الوحدة بسعر التعاقد القديم بدون أي أوفر برايس
                </td>
                <td className="p-4 sm:p-5 text-surface-600">
                  المطور يعيد طرح الوحدة بأسعار السوق الحالية المرتفعة جداً
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

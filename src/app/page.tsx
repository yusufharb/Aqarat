export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-brand-800 mb-4">
            عقار إكزت
          </h1>
          <p className="text-xl text-surface-600">
            منصة التنازل العقاري بدون أوفر
          </p>
        </div>

        <div className="bg-brand-50 border border-brand-200 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-brand-900 mb-4">
            🏗️ المنصة قيد التطوير
          </h2>
          <p className="text-surface-600 leading-relaxed">
            نعمل على بناء منصة آمنة وموثوقة لتسهيل عمليات التنازل عن وحدات
            التقسيط العقاري في مصر. ترقبوا الإطلاق قريباً.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-surface-50 rounded-xl p-4">
            <div className="text-2xl mb-2">🔒</div>
            <h3 className="font-semibold text-surface-800 mb-1">آمنة وموثوقة</h3>
            <p className="text-surface-500">مراجعة شاملة لكل وثيقة وعملية</p>
          </div>
          <div className="bg-surface-50 rounded-xl p-4">
            <div className="text-2xl mb-2">💰</div>
            <h3 className="font-semibold text-surface-800 mb-1">بدون أوفر</h3>
            <p className="text-surface-500">سعر التعاقد الأصلي بدون زيادات</p>
          </div>
          <div className="bg-surface-50 rounded-xl p-4">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold text-surface-800 mb-1">شفافية كاملة</h3>
            <p className="text-surface-500">كل الأرقام موثقة ومتحقق منها</p>
          </div>
        </div>
      </div>
    </main>
  );
}

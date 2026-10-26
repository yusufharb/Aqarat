import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getAuditLogs } from '@/lib/audit';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default async function AdminAuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="min-h-screen flex flex-col bg-surface-50/50">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-surface-200 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-red-900 bg-red-100 px-3 py-0.5 rounded-full">
                  سجل غير قابل للتعديل (Immutable Audit Log)
                </span>
                <span className="text-xs text-surface-400">محمي بـ PostgreSQL Trigger من UPDATE / DELETE</span>
              </div>
              <h1 className="text-3xl font-black text-surface-900">
                سجل تدقيق العمليات والحركات الحساسة
              </h1>
            </div>

            <Link
              href="/admin/cases"
              className="text-xs font-bold text-surface-700 bg-white border border-surface-300 px-4 py-2.5 rounded-xl hover:bg-surface-50"
            >
              ← العودة لجدول الحالات
            </Link>
          </div>

          <div className="bg-white rounded-3xl border border-surface-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-surface-100/70 border-b border-surface-200 text-xs text-surface-600 font-medium">
              يتم تسجيل كل انتقال حالة أو تدقيق مالي أو قرار قانوني أو اعتماد نشر تلقائياً ومحمي من أي تعديل برمجياً.
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200 font-bold text-surface-700">
                    <th className="p-4">معرف السجل</th>
                    <th className="p-4">الكيان (Entity)</th>
                    <th className="p-4">الإجراء (Action)</th>
                    <th className="p-4">المنفذ (Actor)</th>
                    <th className="p-4">التوقيت (UTC / القاهرة)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200 font-mono">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-surface-400 font-sans">
                        لا توجد حركات مسجلة حتى الآن.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-surface-50/70">
                        <td className="p-4 font-bold text-surface-700">{log.id}</td>
                        <td className="p-4 font-sans font-bold text-brand-900">{log.entity_name}</td>
                        <td className="p-4 font-sans font-bold text-surface-900">
                          <span className="bg-surface-100 px-2 py-1 rounded-md">{log.action}</span>
                        </td>
                        <td className="p-4 text-surface-600">{log.actor_id || 'System (تلقائي)'}</td>
                        <td className="p-4 text-surface-500 font-sans">{formatDate(log.timestamp)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { getDataRepository } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { History, ShieldAlert, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ControlRoomAuditLogsPage() {
  const repo = getDataRepository();
  const logs = await repo.getAuditLogs(100);

  return (
    <AppShell
      activeRole="admin"
      pageTitle="سجل التدقيق والمساءلة غير القابل للتعديل"
      pageSubtitle="تسجيل إلزامي مشفر ومحمي بقوادح قاعدة البيانات (Immutable Audit Log) لكافة القرارات وحركات الحالات"
      primaryAction={{
        label: 'العودة لجدول الحالات',
        href: '/control-room/cases',
        icon: <ArrowRight className="w-4 h-4" />,
      }}
    >
      <div className="space-y-6">
        {/* Security Warning Notice */}
        <div className="p-4 bg-surface-900 text-white rounded-2xl border border-surface-800 flex items-start gap-3 text-xs leading-relaxed">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300 block mb-1">
              حماية برمجية ضد التعديل والحذف (Trigger-enforced Immutability):
            </strong>
            أي استعلام `UPDATE` أو `DELETE` موجه لجدول `audit_logs` يُلغى فوراً عبر استثناء PostgreSQL في قاعدة البيانات. السجلات تحفظ هوية المنفذ، عنوان IP، والتوقيت الزمني لضمان الشفافية والمساءلة الكاملة.
          </div>
        </div>

        {/* Audit Log Table Card */}
        <Card>
          <CardHeader className="bg-surface-50/60 pb-3 flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="w-4 h-4 text-brand-700" />
              <span>الحركات والعمليات المسجلة ({logs.length})</span>
            </CardTitle>
            <span className="text-xs text-surface-400 font-mono">سجل الأحداث المباشر</span>
          </CardHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-surface-100/70 border-b border-surface-200 font-bold text-surface-700">
                  <th className="p-4">معرف السجل</th>
                  <th className="p-4">الكيان (Entity)</th>
                  <th className="p-4">الإجراء (Action)</th>
                  <th className="p-4">المنفذ (Actor ID)</th>
                  <th className="p-4">التفاصيل الجديدة</th>
                  <th className="p-4">التوقيت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-200 font-mono">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-10 text-center text-surface-400 font-sans">
                      لا توجد حركات مسجلة حالياً.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-surface-50/70 transition-colors">
                      <td className="p-4 text-surface-400 text-[11px] truncate max-w-[100px]">
                        {log.id}
                      </td>
                      <td className="p-4 font-bold text-surface-800">
                        {log.entity_name}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-800 font-bold text-[11px] border border-brand-200">
                          {log.action}
                        </span>
                      </td>
                      <td className="p-4 text-surface-600 text-[11px] truncate max-w-[120px]">
                        {log.actor_id || 'SYSTEM'}
                      </td>
                      <td className="p-4 text-surface-500 font-sans text-[11px] max-w-xs truncate">
                        {log.new_values ? JSON.stringify(log.new_values) : '—'}
                      </td>
                      <td className="p-4 text-surface-500 text-[11px]">
                        {formatDate(log.timestamp)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

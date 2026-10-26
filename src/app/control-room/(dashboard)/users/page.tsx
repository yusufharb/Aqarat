import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { getDataRepository } from '@/lib/data';
import { formatDate } from '@/lib/utils';
import { Users, UserCheck, UserX, ShieldAlert, Clock, Mail, Phone } from 'lucide-react';
import { UserRowControls } from './UserRowControls';
import { RoleRequestControls } from './RoleRequestControls';
import type { Profile, UserRoleAssignment, RoleRequest } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ControlRoomUsersPage() {
  const repo = getDataRepository();
  const [users, roleRequests] = await Promise.all([
    repo.getAllUsers(),
    repo.getRoleRequests(),
  ]);

  const usersWithRoles = await Promise.all(
    users.map(async (u: Profile) => {
      const roles = await repo.getUserRoles(u.id);
      return {
        user: u,
        roles: roles.map((r: UserRoleAssignment) => r.role),
      };
    })
  );

  const activeUsersCount = users.filter((u) => !u.is_suspended).length;
  const suspendedCount = users.filter((u) => u.is_suspended).length;
  const pendingRequests = roleRequests.filter((r) => r.status === 'pending');

  return (
    <AppShell
      activeRole="admin"
      pageTitle="إدارة المستخدمين والصلاحيات"
      pageSubtitle="البحث في الحسابات، مراجعة طلبات الترقية، وضبط صلاحيات الأدوار وحالات التعليق"
    >
      <div className="space-y-8">
        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <StatCard
            title="إجمالي الحسابات"
            value={users.length}
            subtitle={`${activeUsersCount} حساب نشط`}
            icon={<Users className="w-5 h-5" />}
            highlightColor="brand"
          />
          <StatCard
            title="طلبات ترقية الأدوار"
            value={pendingRequests.length}
            subtitle="تحتاج مراجعة الإدارة"
            icon={<Clock className="w-5 h-5" />}
            highlightColor="amber"
          />
          <StatCard
            title="حسابات موقوفة / معلقة"
            value={suspendedCount}
            subtitle="محظورة من العمليات"
            icon={<UserX className="w-5 h-5" />}
            highlightColor="purple"
          />
        </div>

        {/* Section 1: Role Upgrade Requests */}
        {pendingRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-black text-surface-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <span>طلبات ترقية الصلاحيات المعلقة ({pendingRequests.length})</span>
            </h2>

            <Card>
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="bg-amber-50/70 border-b border-amber-200 font-bold text-amber-950">
                      <th className="p-4">المستخدم</th>
                      <th className="p-4">الدور المطلوب</th>
                      <th className="p-4">سبب الطلب</th>
                      <th className="p-4">تاريخ التقديم</th>
                      <th className="p-4 text-center">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-200">
                    {pendingRequests.map((req) => {
                      const user = users.find((u) => u.id === req.user_id);
                      return (
                        <tr key={req.id} className="hover:bg-surface-50/70">
                          <td className="p-4">
                            <span className="font-bold text-surface-900 block">
                              {user ? user.full_name : req.user_id}
                            </span>
                            <span className="text-surface-400 font-mono text-[11px]">
                              {user?.phone}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-brand-800">
                            {req.requested_role === 'seller' ? 'بائع' : 'مشتري'}
                          </td>
                          <td className="p-4 text-surface-600 max-w-xs">{req.reason || '—'}</td>
                          <td className="p-4 text-surface-500 font-mono">{formatDate(req.created_at)}</td>
                          <td className="p-4 text-center">
                            <RoleRequestControls requestId={req.id} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* Section 2: All Users Directory */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-surface-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-700" />
            <span>دليل المستخدمين المسجلين ({users.length})</span>
          </h2>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="bg-surface-100 border-b border-surface-200 font-bold text-surface-700">
                    <th className="p-4">اسم المستخدم</th>
                    <th className="p-4">بيانات التواصل</th>
                    <th className="p-4">الأدوار الممنوحة</th>
                    <th className="p-4">حالة الحساب</th>
                    <th className="p-4">تاريخ الانضمام</th>
                    <th className="p-4 text-center">التحكم والإدارة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-200">
                  {usersWithRoles.map(({ user, roles }) => (
                    <tr key={user.id} className="hover:bg-surface-50/70 transition-colors">
                      <td className="p-4">
                        <span className="font-bold text-surface-900 text-sm block">
                          {user.full_name}
                        </span>
                        <span className="font-mono text-[11px] text-surface-400">{user.id}</span>
                      </td>

                      <td className="p-4 space-y-1">
                        <div className="flex items-center gap-1.5 text-surface-700 font-mono">
                          <Phone className="w-3.5 h-3.5 text-surface-400" />
                          <span>{user.phone}</span>
                        </div>
                        {user.email && (
                          <div className="flex items-center gap-1.5 text-surface-500 font-mono text-[11px]">
                            <Mail className="w-3.5 h-3.5 text-surface-400" />
                            <span>{user.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {roles.map((r) => (
                            <span
                              key={r}
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                ['admin', 'system_admin'].includes(r)
                                  ? 'bg-purple-100 text-purple-900'
                                  : r === 'seller'
                                  ? 'bg-brand-100 text-brand-900'
                                  : 'bg-blue-100 text-blue-900'
                              }`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="p-4">
                        {user.is_suspended ? (
                          <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded-full text-[11px] font-bold">
                            معلق / موقوف
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold">
                            نشط ومفعل
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-surface-500 font-mono">
                        {formatDate(user.created_at)}
                      </td>

                      <td className="p-4 text-center">
                        <UserRowControls
                          userId={user.id}
                          isSuspended={Boolean(user.is_suspended)}
                          currentRoles={roles}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

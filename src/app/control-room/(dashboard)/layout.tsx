import React from 'react';
import { redirect } from 'next/navigation';
import { getCurrentSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export default async function ControlRoomDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  if (!session) {
    redirect('/control-room/login');
  }

  const staffRoles = [
    'admin',
    'system_admin',
    'operations',
    'finance_reviewer',
    'legal_reviewer',
    'publisher',
  ];

  const hasStaffRole = session.roles.some((r) => staffRoles.includes(r));
  if (!hasStaffRole) {
    redirect('/control-room/login?error=forbidden');
  }

  return <>{children}</>;
}

import { redirect } from 'next/navigation';

export default function AdminAuditLogsRedirect() {
  redirect('/control-room/audit-logs');
}

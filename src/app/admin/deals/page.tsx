import { redirect } from 'next/navigation';

export default function AdminDealsRedirect() {
  redirect('/control-room/deals');
}

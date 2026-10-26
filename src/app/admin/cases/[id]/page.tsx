import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCaseDetailRedirect({ params }: Props) {
  const { id } = await params;
  redirect(`/control-room/cases/${id}`);
}

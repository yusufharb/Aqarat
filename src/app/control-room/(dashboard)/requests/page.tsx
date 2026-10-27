import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { getDataRepository } from '@/lib/data';
import { RequestsClientTabs } from './RequestsClientTabs';

export const dynamic = 'force-dynamic';

export default async function ControlRoomRequestsPage() {
  const repo = getDataRepository();

  const [sellerRequests, buyerRequests, publishedListings, allCases] = await Promise.all([
    repo.getSellerRequests(),
    repo.getBuyerRequests(),
    repo.getPublicListings(),
    repo.getAllCases(),
  ]);

  return (
    <AppShell
      activeRole="admin"
      pageTitle="إدارة طلبات البيع والشراء"
      pageSubtitle="معالجة طلبات التنازل الواردة عبر /sell والمطابقة الذكية لطلبات الشراء الواردة عبر /buy"
    >
      <RequestsClientTabs
        initialSellerRequests={sellerRequests}
        initialBuyerRequests={buyerRequests}
        publishedListings={publishedListings}
        activeCases={allCases}
      />
    </AppShell>
  );
}

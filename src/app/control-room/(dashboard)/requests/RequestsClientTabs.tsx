'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  SellerRequest,
  SellerRequestStatus,
  BuyerRequest,
  BuyerRequestStatus,
  BuyerMatchedListing,
  PublicListing,
  AssignmentCase,
} from '@/lib/types';
import {
  updateSellerRequestStatusAction,
  convertSellerRequestToCaseAction,
  updateBuyerRequestStatusAction,
  convertBuyerRequestToDealAction,
  getSmartMatchesForBuyerAction,
} from './actions';
import { formatEGP, formatDate } from '@/lib/utils';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ArrowRightLeft,
  Building,
  User,
  Phone,
  Mail,
  DollarSign,
  ChevronRight,
  Eye,
  Check,
  X,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Layers,
  FileCheck,
  Send,
} from 'lucide-react';

interface Props {
  initialSellerRequests: SellerRequest[];
  initialBuyerRequests: BuyerRequest[];
  publishedListings: PublicListing[];
  activeCases: AssignmentCase[];
}

export function RequestsClientTabs({
  initialSellerRequests,
  initialBuyerRequests,
  publishedListings,
  activeCases,
}: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sellers' | 'buyers'>('sellers');

  // Seller Requests State
  const [sellerRequests, setSellerRequests] = useState<SellerRequest[]>(initialSellerRequests);
  const [sellerFilter, setSellerFilter] = useState<string>('all');
  const [sellerSearch, setSellerSearch] = useState<string>('');
  const [selectedSellerReq, setSelectedSellerReq] = useState<SellerRequest | null>(null);

  // Buyer Requests State
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>(initialBuyerRequests);
  const [buyerFilter, setBuyerFilter] = useState<string>('all');
  const [buyerSearch, setBuyerSearch] = useState<string>('');
  const [selectedBuyerReq, setSelectedBuyerReq] = useState<BuyerRequest | null>(null);

  // Smart Matching State
  const [smartMatches, setSmartMatches] = useState<BuyerMatchedListing[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);

  // Action Loading & Modal states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Rejection modal state
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionTarget, setRejectionTarget] = useState<'seller' | 'buyer' | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [adminNotesInput, setAdminNotesInput] = useState('');

  // Filtering Seller Requests
  const filteredSellerRequests = sellerRequests.filter((req) => {
    if (sellerFilter !== 'all' && req.status !== sellerFilter) return false;
    if (sellerSearch) {
      const q = sellerSearch.toLowerCase().trim();
      return (
        req.reference_code.toLowerCase().includes(q) ||
        req.full_name.toLowerCase().includes(q) ||
        req.phone.includes(q) ||
        req.project_name.toLowerCase().includes(q) ||
        req.developer_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Filtering Buyer Requests
  const filteredBuyerRequests = buyerRequests.filter((req) => {
    if (buyerFilter !== 'all' && req.status !== buyerFilter) return false;
    if (buyerSearch) {
      const q = buyerSearch.toLowerCase().trim();
      return (
        req.reference_code.toLowerCase().includes(q) ||
        req.full_name.toLowerCase().includes(q) ||
        req.phone.includes(q) ||
        req.preferred_governorates.some((g) => g.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Open Seller Details
  const handleOpenSellerDrawer = (req: SellerRequest) => {
    setSelectedSellerReq(req);
    setAdminNotesInput(req.admin_notes || '');
    setActionError(null);
    setActionSuccess(null);
  };

  // Open Buyer Details & load matching listings
  const handleOpenBuyerDrawer = async (req: BuyerRequest) => {
    setSelectedBuyerReq(req);
    setAdminNotesInput(req.admin_notes || '');
    setActionError(null);
    setActionSuccess(null);
    setSmartMatches([]);
    setLoadingMatches(true);

    try {
      const res = await getSmartMatchesForBuyerAction(req.id);
      if (res.success && res.matches) {
        setSmartMatches(res.matches);
      }
    } catch {
      // ignore
    } finally {
      setLoadingMatches(false);
    }
  };

  // Update Seller Status
  const handleUpdateSellerStatus = async (newStatus: SellerRequestStatus) => {
    if (!selectedSellerReq) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await updateSellerRequestStatusAction(
      selectedSellerReq.id,
      newStatus,
      adminNotesInput
    );
    setActionLoading(false);

    if (res.success && res.request) {
      setActionSuccess(`تم تحديث حالة الطلب إلى "${getStatusLabel(newStatus)}" بنجاح.`);
      setSelectedSellerReq(res.request);
      setSellerRequests((prev) =>
        prev.map((item) => (item.id === res.request!.id ? res.request! : item))
      );
      router.refresh();
    } else {
      setActionError(res.error || 'حدث خطأ أثناء تحديث الحالة.');
    }
  };

  // Convert Seller Request to Case
  const handleConvertToCase = async () => {
    if (!selectedSellerReq) return;
    if (selectedSellerReq.converted_case_id) {
      setActionError(`هذا الطلب تم تحويله بالفعل إلى ملف دراسة (${selectedSellerReq.converted_case_id}).`);
      return;
    }

    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await convertSellerRequestToCaseAction(selectedSellerReq.id);
    setActionLoading(false);

    if (res.success && res.request) {
      setActionSuccess(`تم تحويل الطلب بنجاح إلى ملف دراسة معتمد برقم: ${res.caseId}`);
      setSelectedSellerReq(res.request);
      setSellerRequests((prev) =>
        prev.map((item) => (item.id === res.request!.id ? res.request! : item))
      );
      router.refresh();
    } else {
      setActionError(res.error || 'فشل تحويل الطلب إلى ملف دراسة.');
    }
  };

  // Update Buyer Status
  const handleUpdateBuyerStatus = async (newStatus: BuyerRequestStatus) => {
    if (!selectedBuyerReq) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await updateBuyerRequestStatusAction(
      selectedBuyerReq.id,
      newStatus,
      adminNotesInput
    );
    setActionLoading(false);

    if (res.success && res.request) {
      setActionSuccess(`تم تحديث حالة الطلب إلى "${getStatusLabel(newStatus)}" بنجاح.`);
      setSelectedBuyerReq(res.request);
      setBuyerRequests((prev) =>
        prev.map((item) => (item.id === res.request!.id ? res.request! : item))
      );
      router.refresh();
    } else {
      setActionError(res.error || 'حدث خطأ أثناء تحديث الحالة.');
    }
  };

  // Convert Buyer Request to Deal with selected unit
  const handleConvertToDeal = async (targetCaseId: string) => {
    if (!selectedBuyerReq) return;
    setActionLoading(true);
    setActionError(null);
    setActionSuccess(null);

    const res = await convertBuyerRequestToDealAction(selectedBuyerReq.id, targetCaseId);
    setActionLoading(false);

    if (res.success && res.request) {
      setActionSuccess(`تم ربط الطلب بالوحدة بنجاح وإنشاء صفقة برقم: ${res.dealId}`);
      setSelectedBuyerReq(res.request);
      setBuyerRequests((prev) =>
        prev.map((item) => (item.id === res.request!.id ? res.request! : item))
      );
      router.refresh();
    } else {
      setActionError(res.error || 'فشل تحويل طلب الشراء إلى صفقة.');
    }
  };

  // Trigger Rejection Modal
  const openRejectionModal = (type: 'seller' | 'buyer') => {
    setRejectionTarget(type);
    setRejectionReasonInput('');
    setRejectionModalOpen(true);
  };

  // Submit Rejection
  const handleSubmitRejection = async () => {
    if (!rejectionReasonInput.trim()) {
      alert('سبب الرفض إلزامي عند رفض الطلب.');
      return;
    }

    setActionLoading(true);
    if (rejectionTarget === 'seller' && selectedSellerReq) {
      const res = await updateSellerRequestStatusAction(
        selectedSellerReq.id,
        'rejected',
        adminNotesInput,
        rejectionReasonInput.trim()
      );
      if (res.success && res.request) {
        setSelectedSellerReq(res.request);
        setSellerRequests((prev) =>
          prev.map((item) => (item.id === res.request!.id ? res.request! : item))
        );
        setActionSuccess('تم رفض الطلب وحفظ سبب الرفض بنجاح.');
      } else {
        setActionError(res.error || 'فشل تسجيل الرفض.');
      }
    } else if (rejectionTarget === 'buyer' && selectedBuyerReq) {
      const res = await updateBuyerRequestStatusAction(
        selectedBuyerReq.id,
        'rejected',
        adminNotesInput,
        rejectionReasonInput.trim()
      );
      if (res.success && res.request) {
        setSelectedBuyerReq(res.request);
        setBuyerRequests((prev) =>
          prev.map((item) => (item.id === res.request!.id ? res.request! : item))
        );
        setActionSuccess('تم رفض الطلب وحفظ سبب الرفض بنجاح.');
      } else {
        setActionError(res.error || 'فشل تسجيل الرفض.');
      }
    }

    setActionLoading(false);
    setRejectionModalOpen(false);
    router.refresh();
  };

  // Status Badges helper
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>بانتظار المراجعة</span>
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 border border-blue-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Layers className="w-3 h-3" />
            <span>قيد المراجعة</span>
          </span>
        );
      case 'needs_information':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <AlertCircle className="w-3 h-3" />
            <span>يحتاج استيفاء بيانات</span>
          </span>
        );
      case 'qualified':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            <span>مؤهل للتنازل</span>
          </span>
        );
      case 'matching':
        return (
          <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-800 border border-indigo-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>جاري المطابقة الذكية</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Phone className="w-3 h-3" />
            <span>تم التواصل هاتفياً</span>
          </span>
        );
      case 'converted_to_case':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black px-2.5 py-1 rounded-full">
            <FileCheck className="w-3 h-3" />
            <span>تم التحويل لملف دراسة</span>
          </span>
        );
      case 'converted_to_deal':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black px-2.5 py-1 rounded-full">
            <ShieldCheck className="w-3 h-3" />
            <span>تم التحويل لصفقة جارية</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-800 border border-red-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <XCircle className="w-3 h-3" />
            <span>مرفوض</span>
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 bg-surface-100 text-surface-700 border border-surface-200 text-[11px] font-bold px-2.5 py-1 rounded-full">
            <span>مغلق</span>
          </span>
        );
      default:
        return <span className="text-xs font-bold text-surface-600">{status}</span>;
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'pending': return 'بانتظار المراجعة';
      case 'under_review': return 'قيد المراجعة';
      case 'needs_information': return 'يحتاج استيفاء';
      case 'qualified': return 'مؤهل';
      case 'matching': return 'جاري المطابقة';
      case 'contacted': return 'تم التواصل';
      case 'converted_to_case': return 'تم التحويل لملف دراسة';
      case 'converted_to_deal': return 'تم التحويل لصفقة';
      case 'rejected': return 'مرفوض';
      case 'closed': return 'مغلق';
      default: return s;
    }
  };

  // KPIs
  const pendingSellers = sellerRequests.filter((r) => r.status === 'pending').length;
  const underReviewSellers = sellerRequests.filter((r) => r.status === 'under_review').length;
  const qualifiedSellers = sellerRequests.filter((r) => r.status === 'qualified').length;
  const pendingBuyers = buyerRequests.filter((r) => r.status === 'pending' || r.status === 'matching').length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-surface-500">طلبات بائعين جديدة</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-surface-900">{pendingSellers}</div>
          <div className="text-[11px] text-surface-500 mt-1">بانتظار الفحص والاتصال الأولي</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-surface-500">وحدات قيد الفحص والتدقيق</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-blue-700">{underReviewSellers}</div>
          <div className="text-[11px] text-surface-500 mt-1">مطابقة كشوف الحساب والمطور</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-surface-500">وحدات مؤهلة للتنازل</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{qualifiedSellers}</div>
          <div className="text-[11px] text-surface-500 mt-1">جاهزة للتحويل لملفات دراسة</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-surface-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-surface-500">طلبات مشترين نشطة</span>
            <Sparkles className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-brand-700">{pendingBuyers}</div>
          <div className="text-[11px] text-surface-500 mt-1">ميزانيات جاهزة للمطابقة الذكية</div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-surface-200 pb-2">
        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'sellers'
              ? 'bg-brand-700 text-white shadow-xs'
              : 'bg-white hover:bg-surface-100 text-surface-700 border border-surface-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>طلبات البائعين (بيع وتنازل)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === 'sellers' ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-800'
            }`}
          >
            {sellerRequests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('buyers')}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer ${
            activeTab === 'buyers'
              ? 'bg-brand-700 text-white shadow-xs'
              : 'bg-white hover:bg-surface-100 text-surface-700 border border-surface-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>طلبات المشترين (شراء ومطابقة ذكية)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[11px] ${
              activeTab === 'buyers' ? 'bg-white/20 text-white' : 'bg-surface-200 text-surface-800'
            }`}
          >
            {buyerRequests.length}
          </span>
        </button>
      </div>

      {/* TAB A: SELLER REQUESTS */}
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          {/* Controls: Search and Filter Pills */}
          <div className="bg-white p-4 rounded-2xl border border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={sellerSearch}
                onChange={(e) => setSellerSearch(e.target.value)}
                placeholder="بحث برقم الطلب، المالك، المشروع..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-surface-300 focus:outline-hidden focus:border-brand-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { label: 'الكل', value: 'all' },
                { label: 'بانتظار المراجعة', value: 'pending' },
                { label: 'قيد المراجعة', value: 'under_review' },
                { label: 'مؤهل', value: 'qualified' },
                { label: 'محول لملف', value: 'converted_to_case' },
                { label: 'مرفوض', value: 'rejected' },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setSellerFilter(pill.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    sellerFilter === pill.value
                      ? 'bg-surface-900 text-white'
                      : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-surface-50 border-b border-surface-200 text-surface-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">الرقم المرجعي</th>
                    <th className="py-3 px-4">المالك والتواصل</th>
                    <th className="py-3 px-4">الوحدة والمشروع</th>
                    <th className="py-3 px-4">الماليات (التعاقد / المدفوع / المتبقي)</th>
                    <th className="py-3 px-4">الكاش المطلوب</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredSellerRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-surface-400 font-bold">
                        لا توجد طلبات بائعين تطابق البحث أو الفلتر المحدد.
                      </td>
                    </tr>
                  ) : (
                    filteredSellerRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-surface-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-brand-700">
                          {req.reference_code}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-surface-900">{req.full_name}</div>
                          <div className="text-[11px] text-surface-500 font-mono" dir="ltr">
                            {req.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-surface-800">{req.project_name}</div>
                          <div className="text-[11px] text-surface-500">
                            {req.developer_name} • {req.city_district}
                          </div>
                          <div className="text-[10px] text-surface-400">
                            {req.unit_type} {req.area_sqm ? `• ${req.area_sqm} م²` : ''}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-surface-900 font-bold">{formatEGP(req.total_price)}</div>
                          <div className="text-[11px] text-emerald-700">مدفوع: {formatEGP(req.paid_amount)}</div>
                          <div className="text-[11px] text-surface-500">متبقي: {formatEGP(req.remaining_balance)}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-brand-700">
                          {formatEGP(req.requested_cash_amount || req.paid_amount)}
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(req.status)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleOpenSellerDrawer(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-100 hover:bg-brand-50 text-surface-700 hover:text-brand-700 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>مراجعة</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB B: BUYER REQUESTS */}
      {activeTab === 'buyers' && (
        <div className="space-y-4">
          {/* Controls: Search and Filter Pills */}
          <div className="bg-white p-4 rounded-2xl border border-surface-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-surface-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={buyerSearch}
                onChange={(e) => setBuyerSearch(e.target.value)}
                placeholder="بحث برقم الطلب، المشتري، المحافظة..."
                className="w-full pr-9 pl-3 py-2 text-xs rounded-xl border border-surface-300 focus:outline-hidden focus:border-brand-600"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { label: 'الكل', value: 'all' },
                { label: 'بانتظار المراجعة', value: 'pending' },
                { label: 'قيد المراجعة', value: 'under_review' },
                { label: 'مؤهل', value: 'qualified' },
                { label: 'جاري المطابقة', value: 'matching' },
                { label: 'محول لصفقة', value: 'converted_to_deal' },
                { label: 'مرفوض', value: 'rejected' },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setBuyerFilter(pill.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    buyerFilter === pill.value
                      ? 'bg-surface-900 text-white'
                      : 'bg-surface-100 hover:bg-surface-200 text-surface-700'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-surface-50 border-b border-surface-200 text-surface-600 font-bold">
                  <tr>
                    <th className="py-3 px-4">الرقم المرجعي</th>
                    <th className="py-3 px-4">المشتري والتواصل</th>
                    <th className="py-3 px-4">الكاش المتاح</th>
                    <th className="py-3 px-4">القسط الأقصى المريح</th>
                    <th className="py-3 px-4">المناطق والأنواع المفضلة</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {filteredBuyerRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-surface-400 font-bold">
                        لا توجد طلبات شراء تطابق البحث المحدد.
                      </td>
                    </tr>
                  ) : (
                    filteredBuyerRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-surface-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-black text-brand-700">
                          {req.reference_code}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-surface-900">{req.full_name}</div>
                          <div className="text-[11px] text-surface-500 font-mono" dir="ltr">
                            {req.phone}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                          {formatEGP(req.budget_cash)}
                          {req.is_budget_flexible && (
                            <span className="block text-[10px] text-amber-700 font-sans font-bold">
                              + مرونة 15%
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-surface-900">{formatEGP(req.max_installment)}</div>
                          <div className="text-[11px] text-surface-500">
                            {req.installment_frequency === 'monthly' ? 'شهري' : 'ربع سنوي'}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-surface-800">
                            {req.preferred_governorates.join('، ')}
                          </div>
                          <div className="text-[11px] text-surface-500">
                            {req.preferred_unit_types.join(' • ')}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">{getStatusBadge(req.status)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => handleOpenBuyerDrawer(req)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-xs transition-colors cursor-pointer"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-brand-700" />
                            <span>فحص ومطابقة</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: SELLER REQUEST REVIEW */}
      {selectedSellerReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-surface-900">
                    مراجعة طلب التنازل: {selectedSellerReq.reference_code}
                  </h3>
                  <p className="text-xs text-surface-500">
                    تاريخ الإرسال: {formatDate(selectedSellerReq.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSellerReq(null)}
                className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200">
                <h4 className="font-black text-surface-800 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-700" />
                  <span>بيانات المالك</span>
                </h4>
                <div className="space-y-1.5 text-surface-700">
                  <div><strong>الاسم:</strong> {selectedSellerReq.full_name}</div>
                  <div><strong>الهاتف:</strong> <span dir="ltr">{selectedSellerReq.phone}</span></div>
                  <div><strong>البريد:</strong> {selectedSellerReq.email || 'غير مسجل'}</div>
                </div>
              </div>

              <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200">
                <h4 className="font-black text-surface-800 mb-2 flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-brand-700" />
                  <span>بيانات الوحدة والمشروع</span>
                </h4>
                <div className="space-y-1.5 text-surface-700">
                  <div><strong>المشروع:</strong> {selectedSellerReq.project_name}</div>
                  <div><strong>المطور:</strong> {selectedSellerReq.developer_name}</div>
                  <div><strong>الموقع:</strong> {selectedSellerReq.governorate} • {selectedSellerReq.city_district}</div>
                  <div><strong>نوع الوحدة:</strong> {selectedSellerReq.unit_type} {selectedSellerReq.area_sqm ? `(${selectedSellerReq.area_sqm} م²)` : ''}</div>
                  <div><strong>حالة الاستلام:</strong> {selectedSellerReq.delivery_status}</div>
                </div>
              </div>

              <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200 sm:col-span-2">
                <h4 className="font-black text-surface-800 mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-brand-700" />
                  <span>البيانات المالية للتعاقد</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                  <div>
                    <span className="text-[11px] text-surface-500 font-sans block">سعر العقد الأصلي</span>
                    <strong className="text-surface-900">{formatEGP(selectedSellerReq.total_price)}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-surface-500 font-sans block">المدفوع للمطور</span>
                    <strong className="text-emerald-700">{formatEGP(selectedSellerReq.paid_amount)}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-surface-500 font-sans block">المتبقي بالأقساط</span>
                    <strong className="text-surface-900">{formatEGP(selectedSellerReq.remaining_balance)}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-surface-500 font-sans block">الكاش المطلوب للتنازل</span>
                    <strong className="text-brand-700">{formatEGP(selectedSellerReq.requested_cash_amount || selectedSellerReq.paid_amount)}</strong>
                  </div>
                </div>

                {selectedSellerReq.has_overdue && (
                  <div className="mt-3 pt-3 border-t border-surface-200 text-red-700 font-bold">
                    ⚠️ توجد متأخرات مستحقة للمطور بقيمة: {formatEGP(selectedSellerReq.overdue_amount || 0)}
                  </div>
                )}
                {selectedSellerReq.notes && (
                  <div className="mt-3 pt-3 border-t border-surface-200 text-surface-600">
                    <strong>ملاحظات المالك:</strong> {selectedSellerReq.notes}
                  </div>
                )}
                {selectedSellerReq.rejection_reason && (
                  <div className="mt-3 pt-3 border-t border-red-200 bg-red-50 p-2.5 rounded-xl text-red-800">
                    <strong>سبب الرفض المسجل:</strong> {selectedSellerReq.rejection_reason}
                  </div>
                )}
              </div>
            </div>

            {/* Admin Internal Notes */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-surface-700 mb-1.5">ملاحظات فريق العمل والتدقيق</label>
              <textarea
                rows={2}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="أدخل ملاحظات التدقيق أو نتيجة الاتصال بالمالك..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-surface-300 focus:outline-hidden focus:border-brand-600"
              />
            </div>

            {/* Workflow Action Bar */}
            <div className="border-t border-surface-200 pt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {selectedSellerReq.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateSellerStatus('under_review')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    بدء الفحص والمراجعة
                  </button>
                )}

                {['under_review', 'needs_information'].includes(selectedSellerReq.status) && (
                  <button
                    onClick={() => handleUpdateSellerStatus('qualified')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    اعتماد الطلب كمؤهل للتنازل
                  </button>
                )}

                {selectedSellerReq.status === 'qualified' && !selectedSellerReq.converted_case_id && (
                  <button
                    onClick={handleConvertToCase}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-black text-xs cursor-pointer transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>تحويل إلى ملف دراسة (Case)</span>
                  </button>
                )}

                {selectedSellerReq.converted_case_id && (
                  <Link
                    href={`/control-room/cases`}
                    className="px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  >
                    <span>عرض ملف الحالة المرتبط</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {selectedSellerReq.status !== 'rejected' && selectedSellerReq.status !== 'converted_to_case' && (
                <button
                  onClick={() => openRejectionModal('seller')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  رفض الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DRAWER / MODAL: BUYER REQUEST REVIEW & SMART MATCHER */}
      {selectedBuyerReq && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-surface-900">
                    طلب الشراء والمطابقة الذكية: {selectedBuyerReq.reference_code}
                  </h3>
                  <p className="text-xs text-surface-500">
                    تاريخ الطلب: {formatDate(selectedBuyerReq.created_at)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBuyerReq(null)}
                className="p-2 rounded-xl text-surface-400 hover:text-surface-700 hover:bg-surface-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actionSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{actionError}</span>
              </div>
            )}

            {/* Buyer Profile & Preferences */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs">
              <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200">
                <h4 className="font-black text-surface-800 mb-2 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-700" />
                  <span>بيانات المشتري والاتصال</span>
                </h4>
                <div className="space-y-1.5 text-surface-700">
                  <div><strong>الاسم:</strong> {selectedBuyerReq.full_name}</div>
                  <div><strong>الهاتف:</strong> <span dir="ltr">{selectedBuyerReq.phone}</span></div>
                  <div><strong>البريد:</strong> {selectedBuyerReq.email || 'غير مسجل'}</div>
                </div>
              </div>

              <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200">
                <h4 className="font-black text-surface-800 mb-2 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-brand-700" />
                  <span>القدرة المالية</span>
                </h4>
                <div className="space-y-1.5 text-surface-700 font-mono">
                  <div><strong>الكاش الجاهز:</strong> {formatEGP(selectedBuyerReq.budget_cash)} {selectedBuyerReq.is_budget_flexible ? '(مرن)' : ''}</div>
                  <div><strong>أقصى قسط دوري:</strong> {formatEGP(selectedBuyerReq.max_installment)} ({selectedBuyerReq.installment_frequency || 'ربع سنوي'})</div>
                </div>
              </div>

              <div className="bg-surface-50 p-4 rounded-2xl border border-surface-200 sm:col-span-2">
                <h4 className="font-black text-surface-800 mb-2">التفضيلات والمواصفات المطلوبة</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-surface-700">
                  <div><strong>المحافظات:</strong> {selectedBuyerReq.preferred_governorates.join('، ') || 'أي محافظة'}</div>
                  <div><strong>المناطق:</strong> {selectedBuyerReq.preferred_districts.join('، ') || 'أي منطقة'}</div>
                  <div><strong>الأنواع:</strong> {selectedBuyerReq.preferred_unit_types.join(' • ')}</div>
                </div>
              </div>
            </div>

            {/* Smart Matching Engine Results */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-black text-surface-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-700" />
                  <span>نتائج محرك المطابقة الذكية للوحدات المعتمدة</span>
                </h4>
                <span className="text-[11px] font-bold text-surface-500">
                  {smartMatches.length} وحدة متطابقة
                </span>
              </div>

              {loadingMatches ? (
                <div className="p-8 text-center bg-surface-50 rounded-2xl border border-surface-200">
                  <div className="w-6 h-6 border-2 border-brand-700 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs text-surface-600 font-bold">جاري حساب المطابقات بدقة وتوحيد دوريات الأقساط...</span>
                </div>
              ) : smartMatches.length === 0 ? (
                <div className="p-6 text-center bg-surface-50 rounded-2xl border border-surface-200 text-xs text-surface-500">
                  لا توجد وحدات معتمدة مطابقة لميزانية ومواصفات المشتري في الوقت الحالي. سيتم تنبيهك فور طرح وحدة جديدة.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {smartMatches.map(({ listing, match }) => (
                    <div
                      key={listing.id}
                      className="p-4 rounded-2xl border border-surface-200 bg-white hover:border-brand-300 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-surface-900">
                              {listing.property.project_name} • {listing.property.developer_name}
                            </span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                match.matchType === 'exact'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {match.matchType === 'exact' ? 'تطابق تام' : 'تطابق جزئي'} ({match.score}%)
                            </span>
                          </div>
                          <div className="text-[11px] text-surface-500">
                            {listing.property.governorate} • {listing.property.city_district} • {listing.property.unit_type} {listing.property.area_sqm ? `(${listing.property.area_sqm} م²)` : ''}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-left font-mono">
                            <span className="text-[11px] text-surface-500 block">كاش التنازل</span>
                            <span className="font-black text-brand-700 text-xs sm:text-sm">
                              {formatEGP(listing.total_paid.amount)}
                            </span>
                          </div>

                          {!selectedBuyerReq.converted_deal_id && (
                            <button
                              onClick={() => handleConvertToDeal(listing.id)}
                              disabled={actionLoading}
                              className="px-3.5 py-2 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                            >
                              ربط وإنشاء صفقة
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Explainability bullets */}
                      <div className="border-t border-surface-100 pt-2 mt-2">
                        <ul className="text-[11px] space-y-1 text-surface-600">
                          {match.explanations.map((exp, idx) => (
                            <li key={idx} className="flex items-center gap-1.5">
                              <span className="text-brand-600 font-bold">•</span>
                              <span>{exp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin notes */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-surface-700 mb-1.5">ملاحظات مستشار المبيعات والتواصل</label>
              <textarea
                rows={2}
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                placeholder="أدخل ملخص الاتصال بالمشتري ورغباته..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-surface-300 focus:outline-hidden focus:border-brand-600"
              />
            </div>

            {/* Buyer Workflow Action Bar */}
            <div className="border-t border-surface-200 pt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {selectedBuyerReq.status === 'pending' && (
                  <button
                    onClick={() => handleUpdateBuyerStatus('under_review')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    بدء فحص الطلب
                  </button>
                )}

                {['under_review', 'needs_information'].includes(selectedBuyerReq.status) && (
                  <button
                    onClick={() => handleUpdateBuyerStatus('qualified')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    اعتماد المشتري كمؤهل
                  </button>
                )}

                {['qualified', 'matching'].includes(selectedBuyerReq.status) && (
                  <button
                    onClick={() => handleUpdateBuyerStatus('contacted')}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors"
                  >
                    تسجيل أنه تم التواصل
                  </button>
                )}

                {selectedBuyerReq.converted_deal_id && (
                  <Link
                    href={`/control-room/deals`}
                    className="px-4 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-colors flex items-center gap-1"
                  >
                    <span>عرض الصفقة المرتبطة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>

              {selectedBuyerReq.status !== 'rejected' && selectedBuyerReq.status !== 'converted_to_deal' && (
                <button
                  onClick={() => openRejectionModal('buyer')}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl font-bold text-xs cursor-pointer transition-colors"
                >
                  رفض الطلب
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MANDATORY REJECTION REASON MODAL */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-surface-900">
                  رفض الطلب مع ذكر السبب الإلزامي
                </h3>
                <p className="text-xs text-surface-500">
                  سيتم تسجيل هذا السبب في سجل التدقيق ومشاركته مع العميل.
                </p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-surface-700 mb-1.5">
                سبب الرفض (إلزامي) *
              </label>
              <textarea
                rows={3}
                required
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="مثال: يطلب أوفر برايس إضافي بما يخالف ميثاق التنازل بدون أوفر، أو عدم واقعية الميزانية..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-surface-300 focus:outline-hidden focus:border-red-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-4 py-2 bg-surface-100 hover:bg-surface-200 text-surface-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSubmitRejection}
                disabled={actionLoading || !rejectionReasonInput.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-surface-300 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                {actionLoading ? 'جاري التسجيل...' : 'تأكيد الرفض'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

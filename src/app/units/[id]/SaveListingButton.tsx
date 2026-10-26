'use client';

import { useState } from 'react';
import { toggleSavedListingAction } from './actions';
import { Bookmark } from 'lucide-react';
import Link from 'next/link';

interface SaveListingButtonProps {
  caseId: string;
  initialIsSaved: boolean;
}

export function SaveListingButton({ caseId, initialIsSaved }: SaveListingButtonProps) {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleToggle = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await toggleSavedListingAction(caseId);
      if (res.success && typeof res.isSaved === 'boolean') {
        setIsSaved(res.isSaved);
      } else if (res.requireAuth) {
        setErrorMsg('يرجى تسجيل الدخول كـ مشتري لحفظ الفرصة.');
      }
    } catch (err: any) {
      setErrorMsg('تعذر حفظ الفرصة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading}
        aria-label={isSaved ? 'إزالة من المحفوظات' : 'حفظ الفرصة'}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
          isSaved
            ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
            : 'bg-white text-surface-700 border-surface-200 hover:border-surface-300 hover:bg-surface-50'
        }`}
      >
        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-600' : 'text-surface-400'}`} />
        <span>{isSaved ? 'تم الحفظ في المفضلة' : 'حفظ الفرصة'}</span>
      </button>

      {errorMsg && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-red-200 p-2 rounded-lg text-[11px] text-red-600 shadow-lg z-20 whitespace-nowrap">
          {errorMsg}{' '}
          <Link href={`/auth/login?returnUrl=/units/${caseId}`} className="font-bold underline">
            دخول
          </Link>
        </div>
      )}
    </div>
  );
}

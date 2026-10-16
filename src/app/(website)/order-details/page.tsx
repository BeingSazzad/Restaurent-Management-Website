'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';

export default function OrderDetailsIndexPage() {
  const router = useRouter();
  const orders = useAppSelector((state) => state.orders.orders);
  const activeTrackingId = useAppSelector((state) => state.orders.activeTrackingOrderId);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 1. If there's an active tracking order from recent checkout, navigate to it
    if (activeTrackingId) {
      router.replace(`/order-details/${activeTrackingId}`);
      return;
    }

    // 2. If orders exist in state, navigate to the most recent one
    if (orders && orders.length > 0) {
      const latestOrder = orders[0];
      const targetId = latestOrder.orderNumber || latestOrder.id;
      router.replace(`/order-details/${targetId}`);
      return;
    }

    // 3. Fallback to user orders tab or menu
    if (isAuthenticated) {
      router.replace('/user-dashboard?tab=orders');
    } else {
      router.replace('/menu');
    }
  }, [activeTrackingId, orders, isAuthenticated, router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#FBF9F6]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 border-3 border-[#B84A22] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-stone-500 font-medium">Resolving your order details...</p>
      </div>
    </div>
  );
}

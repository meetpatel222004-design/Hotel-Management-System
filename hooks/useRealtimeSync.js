import { useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, updateGroupStatus } from "@/store/slices/ordersSlice";
import { selectPendingCalls, acceptCall } from "@/store/slices/waiterCallsSlice";

// Simulates realtime updates by polling Redux state changes
// In production, this would be replaced with WebSocket/Socket.IO
export function useRealtimeSync() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const pendingCalls = useSelector(selectPendingCalls);
  const prevRef = useRef({ orderCount: 0, callCount: 0 });

  // Auto-advance "received" orders to "preparing" after a short delay
  // This simulates the kitchen receiving the order
  useEffect(() => {
    const timer = setInterval(() => {
      orders.forEach((order) => {
        order.groups.forEach((group) => {
          if (group.status === "received") {
            const elapsed = Date.now() - group.createdAt;
            if (elapsed > 3000) {
              dispatch(updateGroupStatus({
                orderId: order.id,
                groupId: group.id,
                status: "preparing",
              }));
            }
          }
        });
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [orders, dispatch]);

  // Track changes for notification purposes
  const newOrders = orders.length > prevRef.current.orderCount;
  const newCalls = pendingCalls.length > prevRef.current.callCount;

  useEffect(() => {
    prevRef.current = { orderCount: orders.length, callCount: pendingCalls.length };
  }, [orders.length, pendingCalls.length]);

  return { newOrders, newCalls, pendingCallCount: pendingCalls.length };
}

// Sound alert for waiter calls
export function useCallAlert() {
  const pendingCalls = useSelector(selectPendingCalls);
  const prevCountRef = useRef(0);

  useEffect(() => {
    if (pendingCalls.length > prevCountRef.current && pendingCalls.length > 0) {
      // Try to play a notification sound
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRl9vT19teleGF2ZWZtdCAQAAAAAQABAESsAABErAAAEAAQAGRhdGE=");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      } catch {}
    }
    prevCountRef.current = pendingCalls.length;
  }, [pendingCalls.length]);
}

"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, BellRing, ClipboardList, Plus, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, updateGroupStatus } from "@/store/slices/ordersSlice";
import { selectPendingCalls, acceptCall, resolveCall } from "@/store/slices/waiterCallsSlice";
import { useRealtimeSync, useCallAlert } from "@/hooks/useRealtimeSync";

const CALL_REASONS = {
  water: "Need Water",
  help: "Need Help",
  bill: "Bill Please",
  cleaning: "Need Cleaning",
  order_help: "Order Help",
};

export default function WaiterDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const pendingCalls = useSelector(selectPendingCalls);
  const { pendingCallCount } = useRealtimeSync();
  useCallAlert();

  const handleMarkServed = (orderId, groupId) => {
    dispatch(updateGroupStatus({ orderId, groupId, status: "served" }));
  };

  const handleAcceptCall = (callId) => {
    dispatch(acceptCall({ callId, waiterName: "W001" }));
  };

  const handleResolveCall = (callId) => {
    dispatch(resolveCall(callId));
  };

  // Groups ready to serve
  const readyToServe = orders
    .flatMap((order) =>
      order.groups.map((group) => ({
        ...group,
        orderId: order.id,
        tableNumber: order.tableNumber,
      }))
    )
    .filter((g) => g.status === "ready");

  return (
    <Container className="min-h-screen pb-10 max-w-4xl mx-auto">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur -mx-5 px-5 py-3 border-b border-white/5 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Waiter Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-1">
              {readyToServe.length} ready to serve · {pendingCalls.length} calls
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/waiter/manual-order")}
              className="rounded-xl bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Take Order
            </button>
          </div>
        </div>
      </div>

      {/* Waiter Calls - Alert Section */}
      <AnimatePresence>
        {pendingCalls.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <h2 className="text-sm font-semibold text-red-400 mb-3 px-1 flex items-center gap-2">
              <BellRing className="h-4 w-4 animate-pulse" />
              Customer Calls ({pendingCalls.length})
            </h2>
            <div className="space-y-2">
              {pendingCalls.map((call) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-4 border-2 border-red-500/40 bg-red-500/10 ring-glow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-black">Table {call.tableNumber}</p>
                      <p className="text-sm text-red-400 font-semibold">
                        {CALL_REASONS[call.reason] || call.reason}
                      </p>
                    </div>
                    <BellRing className="h-8 w-8 text-red-400 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAcceptCall(call.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-2xl transition-all"
                    >
                      Accept
                    </motion.button>
                    <button
                      className="rounded-2xl bg-white/5 px-4 py-4 text-muted-foreground hover:bg-white/10 transition"
                    >
                      Busy
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Ready to Serve */}
      <section>
        <h2 className="text-sm font-semibold text-green-500 mb-3 px-1">
          Ready to Serve ({readyToServe.length})
        </h2>

        {readyToServe.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-lg font-semibold text-muted-foreground">No items ready yet</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readyToServe.map((group, idx) => (
              <motion.div
                key={`${group.orderId}-${group.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-3xl p-5 md:p-6 bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent border-2 border-green-500/30 ring-glow overflow-hidden"
              >
                <p className="text-4xl md:text-5xl font-black mb-2">T {group.tableNumber}</p>

                <div className="bg-black/20 rounded-2xl p-4 mb-5">
                  <p className="text-xs text-muted-foreground mb-3 font-semibold">ITEMS TO SERVE</p>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-baseline justify-between">
                        <p className="text-lg md:text-xl font-bold">{item.name}</p>
                        <p className="text-2xl md:text-3xl font-black">x{item.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMarkServed(group.orderId, group.id)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl md:text-2xl py-6 md:py-8 rounded-2xl ring-glow transition-all flex items-center justify-center gap-3"
                >
                  <Check className="h-7 w-7" />
                  SERVED
                </motion.button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Group {group.number} · Order {group.orderId}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </Container>
  );
}

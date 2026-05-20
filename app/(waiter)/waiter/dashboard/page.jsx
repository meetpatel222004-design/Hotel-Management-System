"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, BellRing, ClipboardList, Plus, ShoppingCart,
  Clock, TrendingUp,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, selectActiveOrders, updateGroupStatus } from "@/store/slices/ordersSlice";
import { selectPendingCalls, selectAcceptedCalls, acceptCall, resolveCall } from "@/store/slices/waiterCallsSlice";
import { useRealtimeSync, useCallAlert } from "@/hooks/useRealtimeSync";
import { cn } from "@/lib/cn";

const CALL_REASONS = {
  water: "Need Water",
  help: "Need Help",
  bill: "Bill Please",
  cleaning: "Need Cleaning",
  order_help: "Order Help",
};

const CALL_ICONS = {
  water: "💧",
  help: "❓",
  bill: "🧾",
  cleaning: "✨",
  order_help: "🍽️",
};

export default function WaiterDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const activeOrders = useSelector(selectActiveOrders);
  const pendingCalls = useSelector(selectPendingCalls);
  const acceptedCalls = useSelector(selectAcceptedCalls);
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

  const readyToServe = orders
    .flatMap((order) =>
      order.groups.map((group) => ({
        ...group,
        orderId: order.id,
        tableNumber: order.tableNumber,
        totalAmount: order.totalAmount,
      }))
    )
    .filter((g) => g.status === "ready");

  const inProgress = orders
    .flatMap((order) =>
      order.groups.map((group) => ({
        ...group,
        orderId: order.id,
        tableNumber: order.tableNumber,
      }))
    )
    .filter((g) => g.status !== "served" && g.status !== "completed" && g.status !== "ready");

  const stats = [
    { label: "Ready to Serve", value: readyToServe.length, icon: Check, color: "from-green-500/30 via-green-500/10 to-transparent" },
    { label: "In Kitchen", value: inProgress.length, icon: Clock, color: "from-yellow-500/30 via-yellow-500/10 to-transparent" },
    { label: "Active Calls", value: pendingCalls.length, icon: BellRing, color: "from-red-500/30 via-red-500/10 to-transparent" },
    { label: "Active Orders", value: activeOrders.length, icon: ShoppingCart, color: "from-primary/30 via-primary/10 to-transparent" },
  ];

  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
      <TopBar
        title="Waiter POS"
        subtitle="Live station"
        noBack
        right={
          <button
            onClick={() => router.push("/waiter/manual-order")}
            className="rounded-xl bg-primary text-primary-foreground px-3 py-2 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Take Order
          </button>
        }
      />

      {/* Stats row */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="relative rounded-2xl glass-strong p-4 sm:p-5 overflow-hidden ring-glow"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.color}`} />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
              <div className="grid h-10 w-10 sm:h-12 sm:w-12 place-items-center rounded-2xl bg-white/5">
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Waiter Calls - Alert Section */}
      <AnimatePresence>
        {pendingCalls.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm sm:text-base font-semibold text-red-400 flex items-center gap-2">
                <BellRing className="h-4 w-4 animate-pulse" />
                Customer Calls ({pendingCalls.length})
              </h2>
              <button
                onClick={() => router.push("/waiter/calls")}
                className="text-xs text-primary hover:underline"
              >
                View all
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {pendingCalls.slice(0, 4).map((call) => (
                <motion.div
                  key={call.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl p-4 border-2 border-red-500/40 bg-red-500/10 ring-glow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{CALL_ICONS[call.reason] || "🔔"}</span>
                      <div>
                        <p className="text-lg font-black">T{call.tableNumber}</p>
                        <p className="text-xs text-red-400 font-semibold">
                          {CALL_REASONS[call.reason] || call.reason}
                        </p>
                      </div>
                    </div>
                    <BellRing className="h-6 w-6 text-red-400 animate-pulse" />
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAcceptCall(call.id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-sm py-3 rounded-xl transition-all"
                    >
                      Accept
                    </motion.button>
                    <button className="rounded-xl bg-white/5 px-4 py-3 text-xs text-muted-foreground hover:bg-white/10 transition">
                      Busy
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Accepted calls */}
      {acceptedCalls.length > 0 && (
        <section className="mt-6">
          <h2 className="text-sm sm:text-base font-semibold text-green-500 mb-3 flex items-center gap-2">
            <Check className="h-4 w-4" />
            My Calls ({acceptedCalls.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {acceptedCalls.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{CALL_ICONS[call.reason] || "🔔"}</span>
                  <div>
                    <p className="font-semibold text-sm">T{call.tableNumber}</p>
                    <p className="text-xs text-muted-foreground">{CALL_REASONS[call.reason]}</p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleResolveCall(call.id)}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1 transition"
                >
                  <Check className="h-3.5 w-3.5" />
                  Done
                </motion.button>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Ready to Serve */}
      <section className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-green-500 flex items-center gap-2">
            <Check className="h-4 w-4" />
            Ready to Serve ({readyToServe.length})
          </h2>
          <button
            onClick={() => router.push("/waiter/orders")}
            className="text-xs text-primary hover:underline"
          >
            All orders
          </button>
        </div>

        {readyToServe.length === 0 ? (
          <div className="text-center py-12 glass rounded-2xl">
            <ClipboardList className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-base sm:text-lg font-semibold text-muted-foreground">No items ready yet</p>
            <p className="text-sm text-muted-foreground mt-1">Check back soon</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {readyToServe.map((group, idx) => (
              <motion.div
                key={`${group.orderId}-${group.id}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent border-2 border-green-500/30 ring-glow overflow-hidden"
              >
                <div className="flex items-baseline justify-between mb-3">
                  <p className="text-4xl sm:text-5xl font-black">T{group.tableNumber}</p>
                  <span className="text-xs text-muted-foreground">Group {group.number}</span>
                </div>

                <div className="bg-black/20 rounded-2xl p-4 mb-5">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Items to serve</p>
                  <div className="space-y-2">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-baseline justify-between">
                        <p className="text-sm sm:text-base font-bold truncate">{item.name}</p>
                        <p className="text-xl sm:text-2xl font-black ml-2">x{item.qty}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleMarkServed(group.orderId, group.id)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-base sm:text-lg py-4 sm:py-5 rounded-2xl ring-glow transition-all flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5 sm:h-6 sm:w-6" />
                  SERVED
                </motion.button>

                <p className="text-[10px] text-muted-foreground text-center mt-2">
                  Order {group.orderId}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* In progress summary */}
      {inProgress.length > 0 && (
        <section className="mt-8">
          <h2 className="text-sm sm:text-base font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            In Kitchen ({inProgress.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {inProgress.map((group) => (
              <div
                key={`${group.orderId}-${group.id}`}
                className="glass rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-sm">T{group.tableNumber}</p>
                  <p className="text-xs text-muted-foreground">{group.items.length} items · Group {group.number}</p>
                </div>
                <span className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full",
                  group.status === "received" && "bg-blue-500/15 text-blue-400",
                  group.status === "preparing" && "bg-yellow-500/15 text-yellow-500",
                  group.status === "cooking" && "bg-orange-500/15 text-orange-500",
                )}>
                  {group.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}

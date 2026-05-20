"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, updateGroupStatus } from "@/store/slices/ordersSlice";
import { useRealtimeSync } from "@/hooks/useRealtimeSync";
import { cn } from "@/lib/cn";
import { Check, ChefHat, Flame, BellRing } from "lucide-react";

const ORDER_STATUSES = ["received", "preparing", "cooking", "ready"];

export default function KitchenDashboard() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  useRealtimeSync();

  const getNextStatus = (currentStatus) => {
    const idx = ORDER_STATUSES.indexOf(currentStatus);
    if (idx < 0) return currentStatus;
    return idx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[idx + 1] : currentStatus;
  };

  const handleAdvance = (orderId, groupId, currentStatus) => {
    const next = getNextStatus(currentStatus);
    if (next !== currentStatus) {
      dispatch(updateGroupStatus({ orderId, groupId, status: next }));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      received: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      preparing: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      cooking: "bg-orange-500/20 text-orange-500 border-orange-500/30",
      ready: "bg-green-500/20 text-green-500 border-green-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getButtonStyle = (status) => {
    const styles = {
      received: "bg-blue-500 hover:bg-blue-600",
      preparing: "bg-yellow-500 hover:bg-yellow-600",
      cooking: "bg-orange-500 hover:bg-orange-600",
      ready: "bg-green-500 hover:bg-green-600",
    };
    return styles[status] || "bg-primary";
  };

  const getButtonLabel = (status) => {
    const labels = {
      received: "Start Preparing",
      preparing: "Start Cooking",
      cooking: "Ready for Service",
      ready: "Waiting for Waiter",
    };
    return labels[status] || "Update";
  };

  const getButtonIcon = (status) => {
    const icons = {
      received: ChefHat,
      preparing: Flame,
      cooking: BellRing,
      ready: Check,
    };
    return icons[status] || ChefHat;
  };

  // Show groups that are NOT yet served
  const activeGroups = orders
    .flatMap((order) =>
      order.groups.map((group) => ({
        ...group,
        orderId: order.id,
        tableNumber: order.tableNumber,
      }))
    )
    .filter((g) => g.status !== "served" && g.status !== "completed");

  // Separate into: needs action vs ready (waiting for waiter)
  const needsAction = activeGroups.filter((g) => g.status !== "ready");
  const readyForPickup = activeGroups.filter((g) => g.status === "ready");

  return (
    <Container className="min-h-screen pb-10 max-w-4xl mx-auto">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur -mx-5 px-5 py-3 border-b border-white/5 mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Kitchen</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {needsAction.length} to prepare · {readyForPickup.length} waiting for waiter
        </p>
      </div>

      {activeGroups.length === 0 ? (
        <div className="text-center py-16">
          <ChefHat className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl font-semibold text-muted-foreground">All caught up!</p>
          <p className="text-sm text-muted-foreground mt-1">No orders to prepare right now.</p>
        </div>
      ) : (
        <>
          {/* Needs action */}
          {needsAction.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
                Needs Action ({needsAction.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {needsAction.map((group, idx) => {
                  const Icon = getButtonIcon(group.status);
                  return (
                    <motion.div
                      key={`${group.orderId}-${group.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={cn(
                        "rounded-3xl p-5 md:p-6 border-2 ring-glow overflow-hidden relative",
                        getStatusColor(group.status)
                      )}
                    >
                      <div className="mb-4">
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="text-3xl md:text-4xl font-black">T{group.tableNumber}</p>
                          <p className="text-sm opacity-70">Group {group.number}</p>
                        </div>
                        <p className="text-sm opacity-75">Order {group.orderId}</p>
                      </div>

                      <div className="bg-black/20 rounded-2xl p-4 mb-5">
                        <div className="space-y-3">
                          {group.items.map((item) => (
                            <div key={item.id} className="flex items-baseline justify-between">
                              <p className="text-base md:text-lg font-semibold">{item.name}</p>
                              <p className="text-2xl md:text-3xl font-black">x{item.qty}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAdvance(group.orderId, group.id, group.status)}
                        className={cn(
                          "w-full rounded-2xl text-white font-bold text-lg md:text-xl py-5 md:py-6 ring-glow transition-all flex items-center justify-center gap-3",
                          getButtonStyle(group.status)
                        )}
                      >
                        <Icon className="h-6 w-6" />
                        {getButtonLabel(group.status)}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Ready for pickup */}
          {readyForPickup.length > 0 && (
            <section className="mt-8">
              <h2 className="text-sm font-semibold text-green-500 mb-3 px-1">
                Ready for Waiter ({readyForPickup.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyForPickup.map((group, idx) => (
                  <motion.div
                    key={`${group.orderId}-${group.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="rounded-3xl p-5 md:p-6 border-2 border-green-500/30 bg-green-500/10 ring-glow overflow-hidden relative"
                  >
                    <div className="mb-3">
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-3xl md:text-4xl font-black text-green-500">T{group.tableNumber}</p>
                        <p className="text-sm text-green-500/70">Group {group.number}</p>
                      </div>
                    </div>

                    <div className="bg-black/20 rounded-2xl p-4 mb-4">
                      <div className="space-y-2">
                        {group.items.map((item) => (
                          <div key={item.id} className="flex items-baseline justify-between">
                            <p className="text-base md:text-lg font-semibold">{item.name}</p>
                            <p className="text-2xl font-black">x{item.qty}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-green-500 font-bold text-lg py-3">
                      <BellRing className="h-5 w-5 animate-pulse" />
                      Waiting for waiter to serve
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </Container>
  );
}

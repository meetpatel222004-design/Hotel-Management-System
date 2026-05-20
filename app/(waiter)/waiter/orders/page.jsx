"use client";

import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, updateGroupStatus } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";

export default function WaiterOrdersPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);

  // Show groups that are ready or being prepared
  const activeGroups = orders
    .flatMap((order) =>
      order.groups.map((group) => ({
        ...group,
        orderId: order.id,
        tableNumber: order.tableNumber,
        totalAmount: order.totalAmount,
      }))
    )
    .filter((g) => g.status !== "served" && g.status !== "completed");

  const readyGroups = activeGroups.filter((g) => g.status === "ready");
  const otherGroups = activeGroups.filter((g) => g.status !== "ready");

  return (
    <Container className="min-h-screen pb-10 max-w-2xl mx-auto">
      <TopBar title="All Orders" subtitle="Order tracking" backTo="/waiter/dashboard" />

      {/* Ready to serve */}
      {readyGroups.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-green-500 mb-3 px-1">Ready to Serve ({readyGroups.length})</h2>
          <div className="space-y-3">
            {readyGroups.map((group) => (
              <motion.div
                key={`${group.orderId}-${group.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 border-2 border-green-500/30 bg-green-500/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-2xl font-black">T {group.tableNumber}</p>
                  <StatusPill status={group.status} />
                </div>
                <div className="space-y-1 mb-3">
                  {group.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <span className="font-bold">x{item.qty}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(updateGroupStatus({ orderId: group.orderId, groupId: group.id, status: "served" }))}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <Check className="h-5 w-5" />
                  Mark Served
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* In progress */}
      {otherGroups.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">In Kitchen ({otherGroups.length})</h2>
          <div className="space-y-2">
            {otherGroups.map((group) => (
              <div key={`${group.orderId}-${group.id}`} className="glass rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Table {group.tableNumber}</p>
                  <p className="text-xs text-muted-foreground">{group.items.length} items</p>
                </div>
                <StatusPill status={group.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeGroups.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No active orders</p>
        </div>
      )}
    </Container>
  );
}

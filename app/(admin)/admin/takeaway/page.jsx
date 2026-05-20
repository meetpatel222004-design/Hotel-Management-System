"use client";

import { motion } from "framer-motion";
import { Clock, Check, X, ShoppingBag, Phone } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllTakeawayOrders,
  selectPendingTakeawayOrders,
  acceptTakeawayOrder,
  rejectTakeawayOrder,
  markTakeawayPreparing,
  markTakeawayReady,
  markTakeawayCompleted,
} from "@/store/slices/takeawaySlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";

const STATUS_MAP = {
  pending_review: "received",
  accepted: "preparing",
  preparing: "cooking",
  ready: "ready",
  completed: "completed",
  rejected: "cancelled",
};

export default function AdminTakeawayPage() {
  const dispatch = useDispatch();
  const allOrders = useSelector(selectAllTakeawayOrders);
  const pendingOrders = useSelector(selectPendingTakeawayOrders);
  const activeOrders = allOrders.filter((o) => !["completed", "rejected"].includes(o.status));
  const completedOrders = allOrders.filter((o) => ["completed", "rejected"].includes(o.status));

  return (
    <Container className="min-h-screen pb-10 max-w-5xl mx-auto">
      <TopBar title="Takeaway Orders" subtitle="Review and manage takeaway orders" backTo="/admin/dashboard" />

      {/* Pending review - needs admin action */}
      {pendingOrders.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-red-400 mb-3 px-1 flex items-center gap-2">
            <Clock className="h-4 w-4 animate-pulse" />
            Needs Review ({pendingOrders.length})
          </h2>
          <div className="space-y-3">
            {pendingOrders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 border-2 border-red-500/30 bg-red-500/5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    {order.customerPhone && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Phone className="h-3 w-3" />{order.customerPhone}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="bg-black/20 rounded-xl p-3 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm py-1">
                      <span>{item.name}</span>
                      <span className="font-semibold">x{item.qty} - {formatPrice(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(acceptTakeawayOrder(order.id))}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition flex items-center justify-center gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Accept Order
                  </motion.button>
                  <button
                    onClick={() => dispatch(rejectTakeawayOrder(order.id))}
                    className="rounded-xl bg-red-500/10 text-red-500 px-4 py-3 font-semibold hover:bg-red-500/20 transition flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Active orders */}
      {activeOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3 px-1">Active Orders ({activeOrders.length})</h2>
          <div className="space-y-2">
            {activeOrders.filter((o) => o.status !== "pending_review").map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-strong rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.customerName}</p>
                  </div>
                  <StatusPill status={STATUS_MAP[order.status] || order.status} />
                </div>

                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground">{order.items.length} items</span>
                  <span className="font-bold">{formatPrice(order.totalAmount)}</span>
                </div>

                <div className="flex gap-2">
                  {order.status === "accepted" && (
                    <button
                      onClick={() => dispatch(markTakeawayPreparing(order.id))}
                      className="flex-1 rounded-xl bg-yellow-500/10 text-yellow-500 py-2.5 text-sm font-semibold hover:bg-yellow-500/20 transition"
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => dispatch(markTakeawayReady(order.id))}
                      className="flex-1 rounded-xl bg-green-500/10 text-green-500 py-2.5 text-sm font-semibold hover:bg-green-500/20 transition"
                    >
                      Ready for Pickup
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button
                      onClick={() => dispatch(markTakeawayCompleted(order.id))}
                      className="flex-1 rounded-xl bg-green-500/10 text-green-500 py-2.5 text-sm font-semibold hover:bg-green-500/20 transition"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Completed */}
      {completedOrders.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3 px-1">Completed</h2>
          <div className="space-y-2">
            {completedOrders.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-3 flex items-center justify-between opacity-50">
                <div>
                  <p className="font-medium text-sm">{order.id} - {order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{formatPrice(order.totalAmount)}</p>
                </div>
                <StatusPill status={STATUS_MAP[order.status] || order.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {allOrders.length === 0 && (
        <div className="text-center py-16">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-lg font-semibold text-muted-foreground">No takeaway orders</p>
        </div>
      )}
    </Container>
  );
}

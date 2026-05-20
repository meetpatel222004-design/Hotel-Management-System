"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectAllOrders } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";

export default function AdminOrderDetail() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;
  const orders = useSelector(selectAllOrders);
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <Container className="min-h-screen grid place-items-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">Order not found</p>
          <button
            onClick={() => router.push("/admin/orders")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Back to orders
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="min-h-screen pb-10 max-w-3xl mx-auto">
      <TopBar title={`Order ${order.id}`} subtitle={`Table ${order.tableNumber}`} backTo="/admin/orders" />

      {/* Order header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 glass-strong rounded-3xl p-5 ring-glow"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-3xl font-black">Table {order.tableNumber}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {order.groups.length} group{order.groups.length !== 1 ? "s" : ""}
            </p>
          </div>
          <StatusPill status={order.status} />
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {Math.round((Date.now() - order.createdAt) / 60000)} min ago
          </div>
          <p className="text-xl font-bold">{formatPrice(order.totalAmount)}</p>
        </div>
      </motion.div>

      {/* Order groups */}
      <div className="mt-6 space-y-4">
        {order.groups.map((group, idx) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass rounded-2xl overflow-hidden"
          >
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <div>
                <p className="font-semibold text-sm">Group {group.number}</p>
                <p className="text-xs text-muted-foreground">{group.servingTime}</p>
              </div>
              <StatusPill status={group.status} />
            </div>
            <div className="divide-y divide-white/5">
              {group.items.map((item) => (
                <div key={item.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                  </div>
                  <StatusPill status={item.status} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </Container>
  );
}

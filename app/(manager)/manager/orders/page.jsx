"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectAllOrders } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";

export default function ManagerOrdersPage() {
  const router = useRouter();
  const orders = useSelector(selectAllOrders);

  return (
    <Container className="min-h-screen pb-10 max-w-2xl mx-auto">
      <TopBar title="Orders" subtitle="All active orders" backTo="/manager/dashboard" />

      <div className="mt-6 space-y-3">
        {orders.map((order, idx) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass-strong rounded-2xl p-4 ring-glow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-lg">Table {order.tableNumber}</p>
                  <StatusPill status={order.status} />
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Order #{order.id} · {order.groups.length} group{order.groups.length !== 1 ? "s" : ""}
                </p>
                <div className="flex flex-wrap gap-2">
                  {order.groups.map((group) => (
                    <div key={group.id} className="text-xs bg-white/5 rounded-lg px-2 py-1">
                      Group {group.number}: {group.items.length} items
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-lg">{formatPrice(order.totalAmount)}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3" />
                  {Math.round((Date.now() - order.createdAt) / 60000)} min
                </p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5">
              <p className="text-xs text-muted-foreground mb-1">Items:</p>
              <div className="flex flex-wrap gap-1">
                {order.groups.flatMap((g) => g.items).map((item) => (
                  <span key={item.id} className="text-xs bg-primary/10 text-primary rounded px-2 py-1">
                    {item.name} x{item.qty}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {orders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No active orders</p>
          </div>
        )}
      </div>
    </Container>
  );
}

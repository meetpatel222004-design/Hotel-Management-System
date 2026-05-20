"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingCart, Users, DollarSign, Clock, ChevronRight, UtensilsCrossed, ChefHat, BellRing, Briefcase } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectActiveOrders } from "@/store/slices/ordersSlice";
import { selectOccupiedTables, selectTablesWaitingBill } from "@/store/slices/tablesSlice";
import { selectPendingCalls } from "@/store/slices/waiterCallsSlice";
import { formatPrice } from "@/lib/format";

export default function AdminDashboard() {
  const router = useRouter();
  const activeOrders = useSelector(selectActiveOrders);
  const occupiedTables = useSelector(selectOccupiedTables);
  const waitingBillTables = useSelector(selectTablesWaitingBill);
  const pendingCalls = useSelector(selectPendingCalls);

  const totalRevenue = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    { label: "Active Orders", value: activeOrders.length, icon: ShoppingCart, color: "from-primary/30 via-primary/10 to-transparent", action: () => router.push("/admin/orders") },
    { label: "Occupied Tables", value: occupiedTables.length, icon: Users, color: "from-blue-500/30 via-blue-500/10 to-transparent", action: () => router.push("/admin/tables") },
    { label: "Waiting Bill", value: waitingBillTables.length, icon: DollarSign, color: "from-green-500/30 via-green-500/10 to-transparent", action: () => router.push("/admin/billing") },
    { label: "Today Revenue", value: formatPrice(totalRevenue), icon: Clock, color: "from-yellow-500/30 via-yellow-500/10 to-transparent", action: () => {} },
    { label: "Waiter Calls", value: pendingCalls.length, icon: BellRing, color: "from-red-500/30 via-red-500/10 to-transparent", action: () => {} },
  ];

  const quickActions = [
    { label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
    { label: "Tables", icon: UtensilsCrossed, path: "/admin/tables" },
    { label: "Menu", icon: ChefHat, path: "/admin/menu" },
    { label: "Billing", icon: DollarSign, path: "/admin/billing" },
    { label: "Manager", icon: Briefcase, path: "/manager/dashboard" },
    { label: "Kitchen", icon: ChefHat, path: "/kitchen/dashboard" },
  ];

  return (
    <Container className="min-h-screen pb-10 max-w-4xl mx-auto">
      <TopBar title="Admin Dashboard" subtitle="Restaurant Management" noBack />

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
        {stats.map((stat, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={stat.action}
            className="relative rounded-2xl glass-strong p-4 overflow-hidden ring-glow hover:ring-primary/50 transition-all"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.color}`} />
            <div className="relative">
              <stat.icon className="h-5 w-5 mb-2 text-muted-foreground" />
              <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
              <div className="text-[11px] text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-3 px-1">Quick Actions</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {quickActions.map((action, idx) => (
            <motion.button
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => router.push(action.path)}
              className="glass rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition group"
            >
              <action.icon className="h-5 w-5 text-primary group-hover:scale-110 transition" />
              <span className="text-xs font-semibold text-center">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="text-sm font-semibold">Active Orders</h2>
          <button onClick={() => router.push("/admin/orders")} className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {activeOrders.slice(0, 5).map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass rounded-2xl p-3 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-sm">Table {order.tableNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.groups.length} group{order.groups.length !== 1 ? "s" : ""} · {order.status}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-sm">{formatPrice(order.totalAmount)}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((Date.now() - order.createdAt) / 60000)} min
                </p>
              </div>
            </motion.div>
          ))}
          {activeOrders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">No active orders</p>
          )}
        </div>
      </div>
    </Container>
  );
}

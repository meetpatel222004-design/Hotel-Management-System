"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingCart, Users, DollarSign, Clock, UtensilsCrossed,
  ClipboardList, UserCheck, ChefHat, BellRing, CalendarCheck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectActiveOrders, selectAllOrders } from "@/store/slices/ordersSlice";
import { selectOccupiedTables, selectAllTables } from "@/store/slices/tablesSlice";
import { selectActiveWaitingEntries } from "@/store/slices/waitingListSlice";
import { selectPendingCalls } from "@/store/slices/waiterCallsSlice";
import { formatPrice } from "@/lib/format";
import { StatCard } from "@/components/shared/ResponsiveGrid";

export default function ManagerDashboard() {
  const router = useRouter();
  const activeOrders = useSelector(selectActiveOrders);
  const allOrders = useSelector(selectAllOrders);
  const occupiedTables = useSelector(selectOccupiedTables);
  const allTables = useSelector(selectAllTables);
  const waitingEntries = useSelector(selectActiveWaitingEntries);
  const pendingCalls = useSelector(selectPendingCalls);

  const totalRevenue = allOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    { label: "Active Orders", value: activeOrders.length, icon: ShoppingCart, color: "from-primary/30 via-primary/10 to-transparent", action: () => router.push("/manager/orders") },
    { label: "Occupied Tables", value: occupiedTables.length, icon: Users, color: "from-blue-500/30 via-blue-500/10 to-transparent", action: () => router.push("/manager/tables") },
    { label: "Revenue", value: formatPrice(totalRevenue), icon: DollarSign, color: "from-green-500/30 via-green-500/10 to-transparent", action: () => {} },
    { label: "Waiting List", value: waitingEntries.length, icon: Clock, color: "from-yellow-500/30 via-yellow-500/10 to-transparent", action: () => router.push("/manager/waiting-list") },
    { label: "Waiter Calls", value: pendingCalls.length, icon: BellRing, color: "from-red-500/30 via-red-500/10 to-transparent", action: () => router.push("/manager/waiting-list") },
    { label: "Total Tables", value: allTables.length, icon: UtensilsCrossed, color: "from-accent/30 via-accent/10 to-transparent", action: () => router.push("/manager/tables") },
  ];

  const quickActions = [
    { label: "Tables", icon: UtensilsCrossed, path: "/manager/tables" },
    { label: "Orders", icon: ClipboardList, path: "/manager/orders" },
    { label: "Menu", icon: ChefHat, path: "/manager/menu" },
    { label: "Waiting List", icon: CalendarCheck, path: "/manager/waiting-list" },
    { label: "Staff", icon: UserCheck, path: "/manager/staff" },
    { label: "Waiter Calls", icon: BellRing, path: "/manager/waiting-list" },
  ];

  return (
    <Container className="min-h-screen pb-10 max-w-4xl mx-auto">
      <TopBar title="Manager Dashboard" subtitle="Daily Operations" noBack />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
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

      {/* Recent active orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between px-1 mb-3">
          <h2 className="text-sm font-semibold">Active Orders</h2>
          <button onClick={() => router.push("/manager/orders")} className="text-xs text-primary hover:underline">
            View all
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
                  {order.groups.length} group(s) · {order.status}
                </p>
              </div>
              <p className="font-semibold text-sm">{formatPrice(order.totalAmount)}</p>
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

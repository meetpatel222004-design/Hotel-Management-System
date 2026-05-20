"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ShoppingCart, Users, DollarSign, Clock, UtensilsCrossed,
  ClipboardList, UserCheck, ChefHat, BellRing, CalendarCheck,
  TrendingUp, ChevronRight,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectActiveOrders, selectAllOrders } from "@/store/slices/ordersSlice";
import { selectOccupiedTables, selectAllTables } from "@/store/slices/tablesSlice";
import { selectActiveWaitingEntries } from "@/store/slices/waitingListSlice";
import { selectPendingCalls } from "@/store/slices/waiterCallsSlice";
import { formatPrice } from "@/lib/format";

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
    { label: "Revenue", value: formatPrice(totalRevenue), icon: TrendingUp, color: "from-green-500/30 via-green-500/10 to-transparent", action: () => {} },
    { label: "Waiting List", value: waitingEntries.length, icon: Clock, color: "from-yellow-500/30 via-yellow-500/10 to-transparent", action: () => router.push("/manager/waiting-list") },
    { label: "Waiter Calls", value: pendingCalls.length, icon: BellRing, color: "from-red-500/30 via-red-500/10 to-transparent", action: () => router.push("/manager/calls") },
    { label: "Total Tables", value: allTables.length, icon: UtensilsCrossed, color: "from-accent/30 via-accent/10 to-transparent", action: () => router.push("/manager/tables") },
  ];

  const quickActions = [
    { label: "Tables", icon: UtensilsCrossed, path: "/manager/tables" },
    { label: "Orders", icon: ClipboardList, path: "/manager/orders" },
    { label: "Menu", icon: ChefHat, path: "/manager/menu" },
    { label: "Waiting List", icon: CalendarCheck, path: "/manager/waiting-list" },
    { label: "Staff", icon: UserCheck, path: "/manager/staff" },
    { label: "Waiter Calls", icon: BellRing, path: "/manager/calls" },
  ];

  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
      <TopBar title="Manager Dashboard" subtitle="Daily Operations" noBack />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {stats.map((stat, idx) => (
          <motion.button
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={stat.action}
            className="relative rounded-2xl glass-strong p-5 overflow-hidden ring-glow hover:ring-primary/50 transition-all text-left"
          >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stat.color}`} />
            <div className="relative">
              <stat.icon className="h-5 w-5 mb-3 text-muted-foreground" />
              <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-4 px-1">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
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
        <div className="flex items-center justify-between px-1 mb-4">
          <h2 className="text-sm font-semibold">Active Orders</h2>
          <button onClick={() => router.push("/manager/orders")} className="text-xs text-primary hover:underline flex items-center gap-1">
            View all <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {activeOrders.slice(0, 8).map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-sm">Table {order.tableNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {order.groups.length} group{order.groups.length !== 1 ? "s" : ""} · {order.status}
                </p>
              </div>
              <p className="font-semibold text-sm">{formatPrice(order.totalAmount)}</p>
            </motion.div>
          ))}
          {activeOrders.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6 col-span-full">No active orders</p>
          )}
        </div>
      </div>
    </Container>
  );
}

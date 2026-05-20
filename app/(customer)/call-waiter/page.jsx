"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Droplets, Circle as HelpCircle, Receipt, Sparkles, UtensilsCrossed, Check } from "lucide-react";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { addWaiterCall } from "@/store/slices/waiterCallsSlice";
import { cn } from "@/lib/cn";

const REASONS = [
  { id: "water", label: "Need Water", icon: Droplets, color: "from-blue-500/30 via-blue-500/10 to-transparent" },
  { id: "help", label: "Need Help", icon: HelpCircle, color: "from-yellow-500/30 via-yellow-500/10 to-transparent" },
  { id: "bill", label: "Bill Please", icon: Receipt, color: "from-green-500/30 via-green-500/10 to-transparent" },
  { id: "cleaning", label: "Need Cleaning", icon: Sparkles, color: "from-cyan-500/30 via-cyan-500/10 to-transparent" },
  { id: "order_help", label: "Order Help", icon: UtensilsCrossed, color: "from-primary/30 via-primary/10 to-transparent" },
];

export default function CallWaiterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tableNumber = useSelector((s) => s.dineIn.tableNumber);
  const [called, setCalled] = useState(null);

  const handleCall = (reason) => {
    dispatch(
      addWaiterCall({
        tableId: `table-${tableNumber || "12"}`,
        tableNumber: tableNumber || "12",
        reason,
      })
    );
    setCalled(reason);
    setTimeout(() => setCalled(null), 3000);
  };

  return (
    <Container className="min-h-screen pb-10 max-w-xl mx-auto">
      <TopBar title="Call Waiter" subtitle={tableNumber ? `Table ${tableNumber}` : "Your table"} backTo={tableNumber ? `/restaurant/spice-garden/menu` : "/"} />

      <div className="mt-6">
        <h2 className="text-xl font-bold tracking-tight">What do you need?</h2>
        <p className="text-sm text-muted-foreground mt-1">A waiter will come to your table shortly.</p>
      </div>

      <div className="mt-8 space-y-3">
        {REASONS.map((reason, idx) => {
          const Icon = reason.icon;
          const isCalled = called === reason.id;
          return (
            <motion.button
              key={reason.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => handleCall(reason.id)}
              disabled={!!called}
              className={cn(
                "relative w-full text-left rounded-3xl glass-strong p-5 overflow-hidden ring-glow transition-all",
                isCalled && "border-2 border-green-500/50",
                called && !isCalled && "opacity-40"
              )}
            >
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${reason.color}`} />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 backdrop-blur">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-lg font-bold tracking-tight">{reason.label}</div>
                    <div className="text-xs text-muted-foreground">Tap to call waiter</div>
                  </div>
                </div>
                {isCalled && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="grid h-10 w-10 place-items-center rounded-full bg-green-500 text-white"
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {called && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass rounded-2xl p-4 text-center"
        >
          <p className="text-sm font-semibold text-green-500">Waiter has been called!</p>
          <p className="text-xs text-muted-foreground mt-1">Someone will be with you shortly.</p>
        </motion.div>
      )}
    </Container>
  );
}

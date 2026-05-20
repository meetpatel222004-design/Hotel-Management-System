"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectAllTables } from "@/store/slices/tablesSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";

export default function AdminTablesPage() {
  const router = useRouter();
  const tables = useSelector(selectAllTables);

  const mapStatus = (status) => {
    if (status === "empty") return "available";
    if (status === "waiting-bill") return "waiting";
    return status;
  };

  return (
    <Container className="min-h-screen pb-10 max-w-7xl mx-auto">
      <TopBar title="Tables" subtitle="Table management" backTo="/admin/dashboard" />

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {tables.map((table, idx) => (
          <motion.button
            key={table.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => router.push(`/admin/tables/${table.id}`)}
            className="rounded-2xl p-4 glass-strong text-left ring-glow hover:ring-primary/50 transition-all border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-2xl">T{table.number}</p>
                <p className="text-xs text-muted-foreground">{table.capacity} seats</p>
              </div>
              <StatusPill status={mapStatus(table.status)} />
            </div>

            {table.status !== "empty" && (
              <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5">
                {table.currentOrderId && (
                  <>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Order</span>
                      <span className="font-semibold">{table.currentOrderId}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Bill</span>
                      <span className="font-semibold">{formatPrice(table.runningBill)}</span>
                    </div>
                    {table.activeGroups > 0 && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Groups</span>
                        <span className="font-semibold">{table.activeGroups} cooking</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </Container>
  );
}

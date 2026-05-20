"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { QrCode, Download, Users, DollarSign } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useSelector } from "react-redux";
import { selectAllTables } from "@/store/slices/tablesSlice";
import { selectAllOrders } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";

export default function ManagerTableDetail() {
  const router = useRouter();
  const params = useParams();
  const tableId = params.id;
  const tables = useSelector(selectAllTables);
  const orders = useSelector(selectAllOrders);
  const table = tables.find((t) => t.id === tableId);

  if (!table) {
    return (
      <Container className="min-h-screen grid place-items-center">
        <div className="text-center">
          <p className="text-lg font-semibold text-muted-foreground">Table not found</p>
          <button onClick={() => router.push("/manager/tables")} className="mt-4 text-sm text-primary hover:underline">
            Back to tables
          </button>
        </div>
      </Container>
    );
  }

  const tableOrders = orders.filter((o) => o.tableNumber === table.number);
  const qrData = `plate://restaurant/spice-garden/table/T${table.number}`;

  return (
    <Container className="min-h-screen pb-10 max-w-2xl mx-auto">
      <TopBar title={`Table ${table.number}`} subtitle={`${table.capacity} seats`} backTo="/manager/tables" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 glass-strong rounded-3xl p-5 ring-glow">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-4xl font-black">T{table.number}</p>
            <p className="text-sm text-muted-foreground mt-1">{table.capacity} seats</p>
          </div>
          <StatusPill status={table.status === "empty" ? "available" : table.status === "waiting-bill" ? "waiting" : table.status} />
        </div>

        {table.status !== "empty" && (
          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-3">
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Running Bill</p>
              <p className="text-lg font-bold mt-1">{formatPrice(table.runningBill)}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-xs text-muted-foreground">Active Groups</p>
              <p className="text-lg font-bold mt-1">{table.activeGroups}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* QR Code */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-4 glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold">Table QR Code</h3>
          </div>
          <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        </div>
        <div className="flex justify-center py-4">
          <div className="h-48 w-48 bg-white rounded-2xl grid place-items-center p-6">
            <div className="text-black text-center text-xs font-mono break-all leading-relaxed">
              {qrData}
            </div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          Customers scan this to start ordering at Table {table.number}
        </p>
      </motion.div>

      {/* Orders */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold mb-3 px-1">Orders</h3>
        {tableOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No orders for this table</p>
        ) : (
          <div className="space-y-2">
            {tableOrders.map((order) => (
              <div key={order.id} className="glass rounded-2xl p-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">Order {order.id}</p>
                  <p className="text-xs text-muted-foreground">{order.groups.length} group(s) · {order.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{formatPrice(order.totalAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

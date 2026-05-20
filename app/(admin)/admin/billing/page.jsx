"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Receipt, DollarSign, Clock, Check, CreditCard, ShoppingBag } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllOrders, updateOrderStatus } from "@/store/slices/ordersSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";
import { Modal } from "@/components/shared/Modal";

export default function AdminBillingPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectAllOrders);
  const [selectedBill, setSelectedBill] = useState(null);

  const activeBills = orders.filter((o) => o.status !== "completed");
  const completedBills = orders.filter((o) => o.status === "completed");

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingAmount = activeBills.reduce((sum, o) => sum + o.totalAmount, 0);
  const completedAmount = completedBills.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <Container className="min-h-screen pb-10 max-w-5xl mx-auto">
      <TopBar title="Billing" subtitle="Invoice management" backTo="/admin/dashboard" />

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
          <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="glass-strong rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-500">{formatPrice(pendingAmount)}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-strong rounded-2xl p-4">
          <p className="text-xs text-muted-foreground mb-1">Collected</p>
          <p className="text-2xl font-bold text-green-500">{formatPrice(completedAmount)}</p>
        </motion.div>
      </div>

      {/* Active bills */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-3 px-1 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          Active Bills ({activeBills.length})
        </h2>
        {activeBills.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No active bills</p>
        ) : (
          <div className="space-y-2">
            {activeBills.map((bill) => (
              <motion.button
                key={bill.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedBill(bill)}
                className="w-full glass-strong rounded-2xl p-4 text-left hover:bg-white/5 transition ring-glow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-lg">Table {bill.tableNumber}</p>
                      <StatusPill status={bill.status} />
                    </div>
                    <p className="text-xs text-muted-foreground">Order {bill.id} · {bill.groups.length} group(s)</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{formatPrice(bill.totalAmount)}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                      <Clock className="h-3 w-3" />
                      {Math.round((Date.now() - bill.createdAt) / 60000)} min
                    </p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Completed bills */}
      {completedBills.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3 px-1 flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500" />
            Completed ({completedBills.length})
          </h2>
          <div className="space-y-2">
            {completedBills.map((bill) => (
              <motion.button
                key={bill.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setSelectedBill(bill)}
                className="w-full glass rounded-2xl p-3 text-left opacity-60 hover:opacity-80 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm">Table {bill.tableNumber}</p>
                    <p className="text-xs text-muted-foreground">{bill.id}</p>
                  </div>
                  <p className="font-bold text-sm">{formatPrice(bill.totalAmount)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Bill detail modal */}
      <BillDetailModal
        bill={selectedBill}
        onClose={() => setSelectedBill(null)}
        onMarkPaid={(orderId) => {
          dispatch(updateOrderStatus({ orderId, status: "completed" }));
          setSelectedBill(null);
        }}
      />
    </Container>
  );
}

function BillDetailModal({ bill, onClose, onMarkPaid }) {
  if (!bill) return null;

  const subtotal = bill.totalAmount;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  const allItems = bill.groups.flatMap((g) => g.items);

  return (
    <Modal open={!!bill} onClose={onClose} title={`Bill - Table ${bill.tableNumber}`}>
      <div className="space-y-4">
        {/* Order info */}
        <div className="glass rounded-xl p-3">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-semibold">{bill.id}</span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Status</span>
            <StatusPill status={bill.status} />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Groups</span>
            <span className="font-semibold">{bill.groups.length}</span>
          </div>
        </div>

        {/* Items */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Items</h4>
          <div className="glass rounded-xl divide-y divide-white/5">
            {allItems.map((item) => (
              <div key={item.id} className="p-3 flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">Qty: {item.qty}</p>
                </div>
                <StatusPill status={item.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Bill breakdown */}
        <div className="glass rounded-xl p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (5%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Discount</span>
            <span className="text-green-500">-{formatPrice(0)}</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between font-bold">
            <span>Total</span>
            <span className="text-lg">{formatPrice(total)}</span>
          </div>
        </div>

        {/* Payment status */}
        <div className="flex items-center justify-between glass rounded-xl p-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Payment</span>
          </div>
          <span className={`text-sm font-semibold ${bill.status === "completed" ? "text-green-500" : "text-yellow-500"}`}>
            {bill.status === "completed" ? "Paid" : "Pending"}
          </span>
        </div>

        {/* Actions */}
        {bill.status !== "completed" && (
          <div className="flex gap-3 pt-2">
            <button onClick={onClose} className="flex-1 rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">
              Close
            </button>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onMarkPaid(bill.id)}
              className="flex-1 rounded-2xl bg-green-500 text-white h-12 text-sm font-semibold ring-glow flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" />
              Mark as Paid
            </motion.button>
          </div>
        )}
      </div>
    </Modal>
  );
}

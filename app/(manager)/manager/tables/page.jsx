"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, QrCode, Download } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllTables, updateTableStatus } from "@/store/slices/tablesSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";
import { Modal } from "@/components/shared/Modal";

export default function ManagerTablesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tables = useSelector(selectAllTables);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Container className="min-h-screen pb-10 max-w-4xl mx-auto">
      <TopBar title="Tables" subtitle="Table management" backTo="/manager/dashboard" />

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowAddModal(true)}
        className="mt-6 w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition"
      >
        <Plus className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Add new table</span>
      </motion.button>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {tables.map((table, idx) => (
          <motion.button
            key={table.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => router.push(`/manager/tables/${table.id}`)}
            className="rounded-2xl p-4 glass-strong text-left ring-glow hover:ring-primary/50 transition-all border border-white/10"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-2xl">T{table.number}</p>
                <p className="text-xs text-muted-foreground">{table.capacity} seats</p>
              </div>
              <StatusPill status={table.status === "empty" ? "available" : table.status === "waiting-bill" ? "waiting" : table.status} />
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
                  </>
                )}
              </div>
            )}

            {/* Quick status toggle */}
            <div className="mt-3 flex gap-2">
              {table.status === "empty" && (
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch(updateTableStatus({ tableId: table.id, status: "disabled" })); }}
                  className="flex-1 text-xs rounded-lg bg-white/5 py-1.5 hover:bg-white/10 transition"
                >
                  Disable
                </button>
              )}
              {table.status === "disabled" && (
                <button
                  onClick={(e) => { e.stopPropagation(); dispatch(updateTableStatus({ tableId: table.id, status: "empty" })); }}
                  className="flex-1 text-xs rounded-lg bg-green-500/10 text-green-500 py-1.5 hover:bg-green-500/20 transition"
                >
                  Enable
                </button>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AddTableModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </Container>
  );
}

function AddTableModal({ open, onClose }) {
  const dispatch = useDispatch();
  const tables = useSelector(selectAllTables);
  const [number, setNumber] = useState("");
  const [seats, setSeats] = useState("4");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!number.trim()) return;

    const tableNum = parseInt(number, 10);
    const newTable = {
      id: `table-${Date.now()}`,
      number: tableNum,
      capacity: parseInt(seats, 10) || 4,
      status: "empty",
      currentOrderId: null,
      runningBill: 0,
      activeGroups: 0,
    };

    // Add to tables slice
    dispatch({ type: "tables/addTable", payload: newTable });

    setNumber("");
    setSeats("4");
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Add New Table">
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Table Number</label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="7"
            min="1"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Number of Seats</label>
          <select
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            className="w-full glass rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent"
          >
            <option value="2" className="bg-background">2 seats</option>
            <option value="4" className="bg-background">4 seats</option>
            <option value="6" className="bg-background">6 seats</option>
            <option value="8" className="bg-background">8 seats</option>
            <option value="10" className="bg-background">10 seats</option>
          </select>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">
            Cancel
          </button>
          <button type="submit" className="flex-1 rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow">
            Add Table
          </button>
        </div>
      </form>
    </Modal>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, QrCode } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllTables, updateTableStatus, addTable, toggleTableQR } from "@/store/slices/tablesSlice";
import { formatPrice } from "@/lib/format";
import { StatusPill } from "@/components/shared/StatusPill";
import { Modal } from "@/components/shared/Modal";

export default function ManagerTablesPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const tables = useSelector(selectAllTables);
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
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

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
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
                <p className="font-bold text-xl sm:text-2xl lg:text-3xl">T{table.number}</p>
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
              {table.qrEnabled && (
                <button
                  onClick={(e) => { e.stopPropagation(); router.push(`/manager/tables/${table.id}`); }}
                  className="flex-1 text-xs rounded-lg bg-primary/10 text-primary py-1.5 hover:bg-primary/20 transition flex items-center justify-center gap-1"
                >
                  <QrCode className="h-3 w-3" />
                  QR
                </button>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AddTableModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </Container>
  );
}

function AddTableModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [number, setNumber] = useState("");
  const [seatOption, setSeatOption] = useState("4");
  const [customSeats, setCustomSeats] = useState("");
  const [qrEnabled, setQrEnabled] = useState(true);

  const capacity = seatOption === "custom" ? (parseInt(customSeats, 10) || 4) : parseInt(seatOption, 10);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!number.trim()) return;

    dispatch(addTable({
      id: `table-${Date.now()}`,
      number: parseInt(number, 10),
      capacity,
      status: "empty",
      currentOrderId: null,
      runningBill: 0,
      activeGroups: 0,
      qrEnabled,
      restaurantId: "spice-garden",
    }));

    setNumber("");
    setSeatOption("4");
    setCustomSeats("");
    setQrEnabled(true);
    onClose();
  };

  const seatOptions = [
    { value: "2", label: "2 seats" },
    { value: "4", label: "4 seats" },
    { value: "6", label: "6 seats" },
    { value: "8", label: "8 seats" },
    { value: "10", label: "10 seats" },
    { value: "custom", label: "Custom" },
  ];

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
          <label className="block text-sm font-medium mb-1.5">Seat Capacity</label>
          <div className="grid grid-cols-3 gap-2">
            {seatOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSeatOption(opt.value)}
                className={`rounded-2xl py-2.5 text-sm font-semibold border transition ${
                  seatOption === opt.value
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border glass text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {seatOption === "custom" && (
            <input
              type="number"
              value={customSeats}
              onChange={(e) => setCustomSeats(e.target.value)}
              placeholder="Enter number of seats"
              min="1"
              max="20"
              className="mt-2 w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          )}
        </div>

        <div className="flex items-center justify-between glass rounded-2xl p-4">
          <div>
            <p className="text-sm font-semibold">Enable QR Code</p>
            <p className="text-xs text-muted-foreground">Customers scan QR to order</p>
          </div>
          <button
            type="button"
            onClick={() => setQrEnabled(!qrEnabled)}
            className={`relative h-7 w-12 rounded-full transition-colors ${qrEnabled ? "bg-primary" : "bg-white/10"}`}
          >
            <span
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition-transform ${qrEnabled ? "translate-x-5.5" : "translate-x-0.5"}`}
            />
          </button>
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

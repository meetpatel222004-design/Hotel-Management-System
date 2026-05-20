"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Phone, Users, Clock, UserCheck, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectAllWaitingEntries,
  addWaitingEntry,
  callCustomer,
  seatCustomer,
  cancelWaitingEntry,
} from "@/store/slices/waitingListSlice";
import { selectAllTables } from "@/store/slices/tablesSlice";
import { StatusPill } from "@/components/shared/StatusPill";
import { Modal } from "@/components/shared/Modal";

export default function WaitingListPage() {
  const dispatch = useDispatch();
  const entries = useSelector(selectAllWaitingEntries);
  const tables = useSelector(selectAllTables);
  const [showAddModal, setShowAddModal] = useState(false);

  const availableTables = tables.filter((t) => t.status === "empty");
  const activeEntries = entries.filter((e) => e.status === "waiting" || e.status === "called");
  const completedEntries = entries.filter((e) => e.status === "seated" || e.status === "cancelled");

  return (
    <Container className="min-h-screen pb-10 max-w-2xl mx-auto">
      <TopBar title="Waiting List" subtitle="Manage customer queue" backTo="/manager/dashboard" />

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowAddModal(true)}
        className="mt-6 w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition"
      >
        <Plus className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Add customer to waiting list</span>
      </motion.button>

      {/* Active entries */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold mb-3 px-1">Waiting ({activeEntries.length})</h2>
        {activeEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No one waiting right now</p>
        ) : (
          <div className="space-y-3">
            {activeEntries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-strong rounded-2xl p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-base">{entry.name}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {entry.phone && (
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{entry.phone}</span>
                      )}
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{entry.guestCount} guests</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />~{entry.estimatedWaitMin} min</span>
                    </div>
                  </div>
                  <StatusPill status={entry.status} />
                </div>

                <div className="flex gap-2">
                  {entry.status === "waiting" && (
                    <button
                      onClick={() => dispatch(callCustomer(entry.id))}
                      className="flex-1 rounded-xl bg-blue-500/10 text-blue-500 py-2.5 text-sm font-semibold hover:bg-blue-500/20 transition"
                    >
                      Call Customer
                    </button>
                  )}
                  {entry.status === "called" && availableTables.length > 0 && (
                    <button
                      onClick={() => dispatch(seatCustomer({ entryId: entry.id, tableId: availableTables[0].id }))}
                      className="flex-1 rounded-xl bg-green-500/10 text-green-500 py-2.5 text-sm font-semibold hover:bg-green-500/20 transition"
                    >
                      Seat at T{availableTables[0].number}
                    </button>
                  )}
                  <button
                    onClick={() => dispatch(cancelWaitingEntry(entry.id))}
                    className="rounded-xl bg-white/5 px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Completed entries */}
      {completedEntries.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold mb-3 px-1">Completed</h2>
          <div className="space-y-2">
            {completedEntries.map((entry) => (
              <div key={entry.id} className="glass rounded-2xl p-3 flex items-center justify-between opacity-50">
                <div>
                  <p className="font-medium text-sm">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">{entry.guestCount} guests</p>
                </div>
                <StatusPill status={entry.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <AddWaitingEntryModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(entry) => { dispatch(addWaitingEntry(entry)); setShowAddModal(false); }}
      />
    </Container>
  );
}

function AddWaitingEntryModal({ open, onClose, onAdd }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [estimatedWaitMin, setEstimatedWaitMin] = useState("15");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      guestCount: parseInt(guestCount, 10) || 2,
      estimatedWaitMin: parseInt(estimatedWaitMin, 10) || 15,
    });
    setName(""); setPhone(""); setGuestCount("2"); setEstimatedWaitMin("15");
  };

  return (
    <Modal open={open} onClose={onClose} title="Add to Waiting List">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Customer Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Raj Kumar"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98xxxxxxxx"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1.5">Guests</label>
            <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)}
              className="w-full glass rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent">
              {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((n) => (
                <option key={n} value={n} className="bg-background">{n} guests</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Wait Time</label>
            <select value={estimatedWaitMin} onChange={(e) => setEstimatedWaitMin(e.target.value)}
              className="w-full glass rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent">
              {[5, 10, 15, 20, 30, 45, 60].map((n) => (
                <option key={n} value={n} className="bg-background">{n} min</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
          <button type="submit" className="flex-1 rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow">Add to List</button>
        </div>
      </form>
    </Modal>
  );
}

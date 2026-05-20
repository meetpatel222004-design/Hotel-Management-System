"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Phone, Users, Clock, X, StickyNote } from "lucide-react";
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
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
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

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-strong rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold">{activeEntries.filter((e) => e.status === "waiting").length}</p>
          <p className="text-xs text-muted-foreground">Waiting</p>
        </div>
        <div className="glass-strong rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold">{activeEntries.filter((e) => e.status === "called").length}</p>
          <p className="text-xs text-muted-foreground">Called</p>
        </div>
        <div className="glass-strong rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold">{availableTables.length}</p>
          <p className="text-xs text-muted-foreground">Tables Free</p>
        </div>
      </div>

      {/* Active entries */}
      <div className="mt-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 px-1">Waiting ({activeEntries.length})</h2>
        {activeEntries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No one waiting right now</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
                      {entry.phone && (
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{entry.phone}</span>
                      )}
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{entry.guestCount} guests</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />~{entry.estimatedWaitMin} min</span>
                    </div>
                    {entry.note && (
                      <div className="flex items-start gap-1 mt-1.5 text-xs text-muted-foreground">
                        <StickyNote className="h-3 w-3 mt-0.5 shrink-0" />
                        <span>{entry.note}</span>
                      </div>
                    )}
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
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-3 px-1">Completed</h2>
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
  const [guestOption, setGuestOption] = useState("2");
  const [customGuests, setCustomGuests] = useState("");
  const [estimatedWaitMin, setEstimatedWaitMin] = useState("15");
  const [note, setNote] = useState("");

  const guestCount = guestOption === "custom" ? (parseInt(customGuests, 10) || 1) : parseInt(guestOption, 10);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      phone: phone.trim(),
      guestCount,
      estimatedWaitMin: parseInt(estimatedWaitMin, 10) || 15,
      note: note.trim(),
    });
    resetForm();
  };

  const resetForm = () => {
    setName(""); setPhone(""); setGuestOption("2"); setCustomGuests(""); setEstimatedWaitMin("15"); setNote("");
  };

  const handleClose = () => { resetForm(); onClose(); };

  const guestOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "custom", label: "Custom" },
  ];

  return (
    <Modal open={open} onClose={handleClose} title="Add to Waiting List">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Customer Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Raj Kumar"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Mobile Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98xxxxxxxx" type="tel"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Number of Guests</label>
          <div className="grid grid-cols-4 gap-2">
            {guestOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGuestOption(opt.value)}
                className={`rounded-2xl py-2.5 text-sm font-semibold border transition ${
                  guestOption === opt.value
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border glass text-muted-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {guestOption === "custom" && (
            <input
              type="number"
              value={customGuests}
              onChange={(e) => setCustomGuests(e.target.value)}
              placeholder="Enter guest count"
              min="1"
              max="50"
              className="mt-2 w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Estimated Wait Time</label>
          <select value={estimatedWaitMin} onChange={(e) => setEstimatedWaitMin(e.target.value)}
            className="w-full glass rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-transparent">
            {[5, 10, 15, 20, 30, 45, 60].map((n) => (
              <option key={n} value={n} className="bg-background">{n} min</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Special Note</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. High chair needed, birthday celebration"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="flex-1 rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
          <button type="submit" className="flex-1 rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow">Add to List</button>
        </div>
      </form>
    </Modal>
  );
}

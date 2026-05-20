"use client";

import { motion } from "framer-motion";
import { BellRing, Check, Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllCalls, acceptCall, resolveCall } from "@/store/slices/waiterCallsSlice";
import { StatusPill } from "@/components/shared/StatusPill";

const CALL_REASONS = {
  water: "Need Water",
  help: "Need Help",
  bill: "Bill Please",
  cleaning: "Need Cleaning",
  order_help: "Order Help",
};

export default function ManagerCallsPage() {
  const dispatch = useDispatch();
  const calls = useSelector(selectAllCalls);

  const pending = calls.filter((c) => c.status === "pending");
  const accepted = calls.filter((c) => c.status === "accepted");
  const resolved = calls.filter((c) => c.status === "resolved");

  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
      <TopBar title="Waiter Calls" subtitle="Customer call requests" backTo="/manager/dashboard" />

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-strong rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{pending.length}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="glass-strong rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-blue-400">{accepted.length}</p>
          <p className="text-xs text-muted-foreground">Accepted</p>
        </div>
        <div className="glass-strong rounded-2xl p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{resolved.length}</p>
          <p className="text-xs text-muted-foreground">Resolved</p>
        </div>
      </div>

      {/* Pending calls */}
      {pending.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-red-400 mb-3 px-1 flex items-center gap-2">
            <BellRing className="h-4 w-4 animate-pulse" />
            Pending ({pending.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {pending.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl p-4 border-2 border-red-500/40 bg-red-500/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-black">Table {call.tableNumber}</p>
                  <BellRing className="h-6 w-6 text-red-400 animate-pulse" />
                </div>
                <p className="text-sm text-red-400 font-semibold mb-3">{CALL_REASONS[call.reason]}</p>
                <p className="text-xs text-muted-foreground mb-3">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {Math.round((Date.now() - call.createdAt) / 60000)} min ago
                </p>
                <StatusPill status={call.status} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted calls */}
      {accepted.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-blue-400 mb-3 px-1">Accepted ({accepted.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {accepted.map((call) => (
              <div key={call.id} className="glass rounded-2xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold">Table {call.tableNumber}</p>
                  <StatusPill status={call.status} />
                </div>
                <p className="text-xs text-muted-foreground">{CALL_REASONS[call.reason]} · by {call.acceptedBy}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolved.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-green-400 mb-3 px-1">Resolved ({resolved.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {resolved.map((call) => (
              <div key={call.id} className="glass rounded-2xl p-3 opacity-50">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Table {call.tableNumber}</p>
                  <StatusPill status={call.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {calls.length === 0 && (
        <div className="text-center py-16">
          <BellRing className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
          <p className="text-lg font-semibold text-muted-foreground">No waiter calls</p>
        </div>
      )}
    </Container>
  );
}

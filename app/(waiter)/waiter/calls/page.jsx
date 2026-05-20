"use client";

import { motion } from "framer-motion";
import { BellRing, Check, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { useDispatch, useSelector } from "react-redux";
import { selectAllCalls, acceptCall, resolveCall } from "@/store/slices/waiterCallsSlice";

const CALL_REASONS = {
  water: "Need Water",
  help: "Need Help",
  bill: "Bill Please",
  cleaning: "Need Cleaning",
  order_help: "Order Help",
};

export default function WaiterCallsPage() {
  const dispatch = useDispatch();
  const calls = useSelector(selectAllCalls);

  const pending = calls.filter((c) => c.status === "pending");
  const accepted = calls.filter((c) => c.status === "accepted");

  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
      <TopBar title="Waiter Calls" subtitle="Customer requests" backTo="/waiter/dashboard" />

      {/* Pending calls */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-red-400 mb-3 px-1 flex items-center gap-2">
          <BellRing className="h-4 w-4 animate-pulse" />
          Pending ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No pending calls</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {pending.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-4 border-2 border-red-500/40 bg-red-500/10"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-black">Table {call.tableNumber}</p>
                    <p className="text-sm text-red-400 font-semibold">{CALL_REASONS[call.reason]}</p>
                  </div>
                  <BellRing className="h-8 w-8 text-red-400 animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => dispatch(acceptCall({ callId: call.id, waiterName: "W001" }))}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-2xl transition-all"
                  >
                    Accept
                  </motion.button>
                  <button className="rounded-2xl bg-white/5 px-4 py-4 text-muted-foreground hover:bg-white/10 transition">
                    Busy
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Accepted calls */}
      {accepted.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-semibold text-green-500 mb-3 px-1">My Accepted Calls ({accepted.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {accepted.map((call) => (
              <motion.div
                key={call.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-semibold">Table {call.tableNumber}</p>
                  <p className="text-xs text-muted-foreground">{CALL_REASONS[call.reason]}</p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => dispatch(resolveCall(call.id))}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-xl text-sm flex items-center gap-1.5 transition"
                >
                  <Check className="h-4 w-4" />
                  Done
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}

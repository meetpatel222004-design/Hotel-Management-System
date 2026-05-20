"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, UserCheck, ChefHat, Briefcase, User, Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";
import { Modal } from "@/components/shared/Modal";

const DEMO_STAFF = [
  { id: "s1", name: "Ravi Kumar", role: "waiter", staffId: "W001", isActive: true },
  { id: "s2", name: "Sunil Yadav", role: "waiter", staffId: "W002", isActive: true },
  { id: "s3", name: "Anil Sharma", role: "kitchen", staffId: "K001", isActive: true },
  { id: "s4", name: "Priya Singh", role: "manager", staffId: "M001", isActive: true },
];

const ROLE_ICONS = {
  waiter: User,
  kitchen: ChefHat,
  manager: Briefcase,
  admin: UserCheck,
};

const ROLE_LABELS = {
  waiter: "Waiter",
  kitchen: "Kitchen Staff",
  manager: "Manager",
  admin: "Admin",
};

const ROLE_ACCESS = {
  waiter: ["Take orders", "View calls", "Serve food"],
  kitchen: ["View orders", "Update cooking status"],
  manager: ["Manage tables", "Manage menu", "Manage staff", "View orders", "Waiting list"],
  admin: ["Full restaurant control", "Billing", "Reports", "Settings"],
};

export default function ManagerStaffPage() {
  const [staff] = useState(DEMO_STAFF);
  const [showAddModal, setShowAddModal] = useState(false);

  const grouped = {
    waiter: staff.filter((s) => s.role === "waiter"),
    kitchen: staff.filter((s) => s.role === "kitchen"),
    manager: staff.filter((s) => s.role === "manager"),
  };

  return (
    <Container className="min-h-screen pb-10 max-w-5xl mx-auto">
      <TopBar title="Staff" subtitle="Manage staff accounts" backTo="/manager/dashboard" />

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setShowAddModal(true)}
        className="mt-6 w-full glass rounded-2xl p-4 flex items-center justify-center gap-2 hover:bg-white/10 transition"
      >
        <Plus className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">Add staff member</span>
      </motion.button>

      {Object.entries(grouped).map(([role, members]) => {
        if (members.length === 0) return null;
        const Icon = ROLE_ICONS[role];
        return (
          <div key={role} className="mt-8">
            <h2 className="text-sm font-semibold mb-3 px-1 flex items-center gap-2">
              <Icon className="h-4 w-4 text-primary" />
              {ROLE_LABELS[role]}s
            </h2>
            <div className="space-y-2">
              {members.map((member) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass rounded-2xl p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{member.name}</p>
                      <p className="text-xs text-muted-foreground">ID: {member.staffId}</p>
                    </div>
                    <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${member.isActive ? "bg-green-500/15 text-green-500" : "bg-red-500/15 text-red-500"}`}>
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {/* Access info */}
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-xs text-muted-foreground mb-1.5">Access:</p>
                    <div className="flex flex-wrap gap-1">
                      {(ROLE_ACCESS[role] || []).map((perm) => (
                        <span key={perm} className="text-xs bg-white/5 rounded-lg px-2 py-1">{perm}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

      <AddStaffModal open={showAddModal} onClose={() => setShowAddModal(false)} />
    </Container>
  );
}

function AddStaffModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("waiter");
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (password && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password && password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setError("");
    setName(""); setRole("waiter"); setStaffId(""); setPassword(""); setConfirmPassword("");
    onClose();
  };

  const handleClose = () => {
    setName(""); setRole("waiter"); setStaffId(""); setPassword(""); setConfirmPassword(""); setError("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add Staff Member">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">Full Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ravi Kumar"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Staff ID</label>
          <input value={staffId} onChange={(e) => setStaffId(e.target.value)} placeholder="e.g. W003"
            className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Role</label>
          <div className="grid grid-cols-3 gap-2">
            {["waiter", "kitchen", "manager"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-2xl py-3 text-sm font-semibold border transition ${
                  role === r ? "border-primary/50 bg-primary/10 text-primary" : "border-border glass text-muted-foreground"
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Access: {(ROLE_ACCESS[role] || []).join(", ")}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="Set login password"
              className="w-full glass rounded-2xl px-4 py-3 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        {password && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
              placeholder="Re-enter password"
              className="w-full glass rounded-2xl px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={handleClose} className="flex-1 rounded-2xl border border-border h-12 text-sm font-semibold hover:bg-white/5 transition">Cancel</button>
          <button type="submit" className="flex-1 rounded-2xl bg-primary text-primary-foreground h-12 text-sm font-semibold ring-glow">Add Staff</button>
        </div>
      </form>
    </Modal>
  );
}

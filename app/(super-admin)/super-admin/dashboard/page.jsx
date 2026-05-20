"use client";

import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";

export default function SuperAdminDashboard() {
  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
      <TopBar title="Platform Dashboard" subtitle="Platform-wide metrics" noBack />
      <div className="mt-8 glass rounded-2xl p-8 text-center text-muted-foreground text-sm">Platform dashboard coming soon.</div>
    </Container>
  );
}

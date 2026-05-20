"use client";

import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";

export default function SuperAdminAnalytics() {
  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
      <TopBar title="Analytics" subtitle="Platform-wide insights" noBack />
      <div className="mt-8 glass rounded-2xl p-8 text-center text-muted-foreground text-sm">Analytics dashboard coming soon.</div>
    </Container>
  );
}

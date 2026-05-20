"use client";

import { Container } from "@/components/ui/Container";
import { TopBar } from "@/components/layout/TopBar";

export default function SuperAdminRestaurants() {
  return (
    <Container className="min-h-screen pb-10 max-w-[1600px] mx-auto">
      <TopBar title="Restaurants" subtitle="Manage all restaurants" noBack />
      <div className="mt-8 glass rounded-2xl p-8 text-center text-muted-foreground text-sm">Restaurant management coming soon.</div>
    </Container>
  );
}

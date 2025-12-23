"use client";

import { SnackbarProvider } from "@/components/ui/dialogBoxes/SnackBarManager";

export default function SnackbarClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SnackbarProvider>{children}</SnackbarProvider>;
}

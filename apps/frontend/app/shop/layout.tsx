import SnackbarClientProvider from "@/providers/SnackbarClientProvider";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <SnackbarClientProvider>{children}</SnackbarClientProvider>
    </div>
  );
}

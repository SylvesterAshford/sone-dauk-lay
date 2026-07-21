// The product (/) is a self-contained state machine that renders its own header,
// nav, Lens and mascot. Other (app) routes (admin) keep their own chrome.
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen">{children}</div>;
}

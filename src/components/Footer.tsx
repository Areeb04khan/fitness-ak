export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 py-4 mt-8">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          © {new Date().getFullYear()} <span className="font-medium text-foreground">Areeb Khan</span>. All rights reserved.
        </span>
        <span className="text-center">
          Created &amp; developed by <span className="font-medium text-foreground">Areeb Khan</span>
          {" · "}
          <span className="italic">All content, design &amp; code are proprietary and may not be copied or reused.</span>
        </span>
      </div>
    </footer>
  );
}

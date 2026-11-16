export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 py-4 mt-8">
      <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          © {new Date().getFullYear()} <span className="font-medium text-foreground">Areeb Khan</span>. All rights reserved.
        </span>
        
        {/* Developer Credit & WhatsApp Button */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-4 border-t border-gold/10 pt-8 w-full justify-center">
          <p className="text-cream/20 text-sm font-medium tracking-wide">
            Website Designed & Developed by Areeb Khan
          </p>
          <a
            href="https://wa.me/919580111566"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] text-white px-5 py-2.5 rounded-full text-sm font-bold tracking-wide shadow-lg shadow-[#25D366]/20 transition-transform duration-300 hover:scale-105 hover:bg-[#20bd5a]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
            </svg>
            Chat with Areeb
          </a>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-1">
          {" · "}
          <span className="italic">All content, design &amp; code are proprietary and may not be copied or reused.</span>
        </div>
      </div>
    </footer>
  );
}

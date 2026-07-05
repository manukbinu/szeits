import { siteConfig } from "@/lib/constants";

export default function WhatsAppButton() {
  const number = siteConfig.phoneHref.replace(/[^\d]/g, "");

  return (
    <a
      href={`https://wa.me/${number}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
      style={{ background: "#25D366", boxShadow: "0 8px 24px rgba(37,211,102,0.45)" }}
    >
      <svg viewBox="0 0 24 24" fill="#ffffff" className="h-7 w-7">
        <path d="M12.04 2c-5.52 0-10 4.48-10 10 0 1.77.46 3.5 1.34 5.02L2 22l5.13-1.35A9.96 9.96 0 0 0 12.04 22c5.52 0 10-4.48 10-10s-4.48-10-10-10Zm0 18.13c-1.6 0-3.17-.43-4.53-1.24l-.32-.19-3.05.8.81-2.97-.21-.31A8.1 8.1 0 0 1 3.9 12c0-4.5 3.66-8.13 8.14-8.13 4.47 0 8.13 3.63 8.13 8.13s-3.66 8.13-8.13 8.13Zm4.47-6.09c-.24-.12-1.44-.71-1.67-.79-.22-.08-.38-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.53.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.43-1.35-1.67-.14-.24-.02-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.55-1.32-.75-1.8-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.42.06-.64.3-.22.24-.85.83-.85 2.02 0 1.19.87 2.34 1 2.5.12.16 1.7 2.6 4.13 3.64.58.25 1.03.4 1.38.51.58.18 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
      </svg>
    </a>
  );
}

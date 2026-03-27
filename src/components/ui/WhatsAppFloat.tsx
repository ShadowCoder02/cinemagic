import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/94776216556"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-[60] inline-flex items-center justify-center rounded-full bg-[#25D366] p-3 text-white shadow-lg shadow-green-500/40 transition-transform duration-200 hover:scale-105 hover:bg-[#1ebc59] focus:outline-none focus:ring-2 focus:ring-white/80"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}

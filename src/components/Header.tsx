export default function Header() {
  return (
    <header className="h-20 bg-[#FBFBFA]/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 transition-all duration-300 flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-center">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <img 
            src="https://res.cloudinary.com/dtkluxukm/image/upload/v1781877708/8_cwwfre.png" 
            alt="Audit Engine Logo"
            className="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="font-bold tracking-tight text-base uppercase text-[#1A1A1A] font-sans">
              Audit <span className="text-[#42c28b]">Engine™</span>
            </span>
            <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase leading-none mt-0.5">
              WEB DESIGN KING
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

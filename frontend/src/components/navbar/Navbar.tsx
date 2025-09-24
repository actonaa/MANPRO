export default function Navbar() {
  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between p-2 px-10 py-2">
        {/* Logo and Partners */}
        <div className="flex items-center px-6 py-2">
          <img
            src="/login/logogroup.png"
            alt="Gabungan Logo"
            className="h-16 object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-8 text-white">
          <a
            href="#"
            className="hover:text-blue-200 transition-colors hover:underline"
          >
            Beranda
          </a>
          <span className="text-blue-200">•</span>
          <a
            href="#"
            className="hover:text-blue-200 transition-colors hover:underline"
          >
            Tentang Kami
          </a>
          <span className="text-blue-200">•</span>
          <button className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-2 rounded-lg hover:bg-white/30 transition-all">
            Login SSO
          </button>
        </nav>
      </header>
    </>
  );
}

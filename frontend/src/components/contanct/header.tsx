interface HeaderProps {
  isSidebarOpen?: boolean;
  toggleSidebar: () => void;
  onSearchChange: (value: string) => void; // ⬅️ tambahan
}

export default function Header({
  isSidebarOpen = true,
  toggleSidebar,
  onSearchChange,
}: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 w-full z-40 transition-all duration-300">
      <div
        className={`flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 transition-all duration-300 
        ${isSidebarOpen ? "lg:pl-64" : "lg:pl-20"} pl-0`}
      >
        {/* Tombol toggle di mobile */}
        <button
          className="lg:hidden mr-2 p-2 rounded-md bg-gray-100"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-[160px] sm:w-[220px] md:w-[280px] lg:w-[350px] px-2 sm:px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari"
              onChange={(e) => onSearchChange(e.target.value)} // ⬅️ kirim ke parent
              className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1 sm:py-2 text-xs sm:text-sm rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 absolute left-2.5 sm:left-3 top-1.5 sm:top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Profil User */}
        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          <div className="text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-medium text-gray-700">
              Monica
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">Dinas</p>
          </div>
          <div className="bg-gray-200 rounded-full h-8 w-8 sm:h-10 sm:w-10 overflow-hidden">
            <img
              src="/img/user-profile.png"
              alt="User"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

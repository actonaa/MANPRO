import Navbar from "../../components/navbar/Navbar";

export default function Beranda() {
  return (
    <div
      className="min-h-screen bg-[#F0F0F0] bg-top bg-no-repeat  bg-[length:100%_22%]"
      style={{ backgroundImage: "url('/login/logo-about.png')" }}
    >
      <Navbar />

      {/* Main Content */}
      <main className="px-8 py-4">
        {/* Logo Center */}
        <div className="flex justify-center mb-2">
          <div className=" flex items-center justify-center">
            <img
              src="/login/saga.png"
              alt="Logo SAGA"
              className="w-40 h-25 object-contain"
            />
          </div>
        </div>

        {/* Description */}
        <div className="text-center mb-10 max-w-3xl mx-auto text-[#134F73]">
          <p className=" text-lg leading-relaxed">
            <strong>Single Sign On SAGA</strong> (Satu Gerbang Akses) merupakan{" "}
            <strong>User Management</strong> 3 mitra aplikasi untuk memberikan
            layanan pada instansi dalam kemudahan management project.
          </p>
        </div>

        {/* Services List */}
        <div className="flex flex-col max-w-3xl mx-auto space-y-10 text-[#134F73]">
          {/* SEDIA */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4">
              {/* Gambar + Teks */}
              <div className=" flex items-center justify-center">
                <img
                  src="/login/about-sedia.png"
                  alt="SEDIA"
                  className="w-70 h-full object-cover"
                />
              </div>
            </div>
            <p className="text-lg leading-relaxed flex-1">
              Kelola insiden dan permintaan layanan dengan transparan dan
              efisien.
            </p>
          </div>

          {/* SiKonfi */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4">
              <div className=" flex items-center justify-center">
                <img
                  src="/login/about-sikonfi.png"
                  alt="SiKonfi"
                  className="w-70 h-full object-cover"
                />
              </div>
            </div>
            <p className="text-lg leading-relaxed flex-1">
              Kelola perubahan dan konfigurasi dengan cara yang lebih mudah,
              cepat, dan terintegrasi.
            </p>
          </div>

          {/* SIRASA */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-4">
              <div className=" flex items-center justify-center">
                <img
                  src="/login/about-sirasa.png"
                  alt="SIRASA"
                  className="w-50 h-full object-cover"
                />
              </div>
            </div>
            <p className="text-lg leading-relaxed flex-1 pl-20">
              Kelola aset dan kepatuhan risiko dalam satu tempat terintegrasi.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-6 mt-20">
        <img
          src="/login/footer.png"
          alt="Copyright SAGA 2025"
          className="mx-auto h-4 object-contain"
        />
      </footer>
      </main>
    </div>
  );
}

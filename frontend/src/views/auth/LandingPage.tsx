import Navbar from "../../components/navbar/Navbar";

export default function LandingPage() {
  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-no-repeat  bg-[position:center_-140px]"
      style={{ backgroundImage: "url('/login/Vector.png')" }}
    >
      < Navbar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center font-open px-6 -mt-10 ">
        <div className="text-center text-white max-w-2xl">
          <h1 className="text-5xl font-light mb-4">Single Sign On</h1>
          <p className="font-semibold text-5xl mb-2">SAGA</p>

          <p className="text-xl mb-2">(Satu Gerbang Akses)</p>

          <div className="mb-6 space-y-1 text-[15px]">
            <p>
              Silakan masuk menggunakan{" "}
              <span className="font-semibold">Email Instansi</span> Anda,
            </p>
            <p>
              Untuk menikmati seluruh layanan{" "}
              <span className="font-semibold">SAGA</span> (Satu Gerbang Akses)
              ke
            </p>
            <p>
              sistem terpadu{" "}
              <span className="font-semibold">
                Service Desk, Aset & Risiko, serta Change & Config.
              </span>
            </p>
          </div>

          <button className="bg-white text-blue-800 font-semibold px-25 py-3 rounded-xl text-lg hover:bg-blue-50 transition-colors shadow-lg">
            Login SSO
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6">
        <img
          src="/login/footer.png"
          alt="Copyright SAGA 2025"
          className="mx-auto h-4 object-contain"
        />
      </footer>
    </div>
  );
}

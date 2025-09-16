import BtnLogin from "../../components/button/BtnLogin";
import InputLogin from "../../components/input/InputLogin";
import Logingambar from "../../img/Right-column.png";
import Logo from "../../img/Logo.png";

export default function Login() {
  return (
    <div className="h-screen px-4 ">
      {/* Header */}
      <header className="w-[375px] h-[43px] max-w-md py-2 px-5">
        <img src={Logo} alt="Logo" className="h-6 w-auto" />
      </header>
      <div className="flex items-center justify-center">
        <div className="w-[375px] h-[532px]">
          {/* Gambar */}
          <img
            src={Logingambar}
            alt="Login Banner"
            className="w-[335px] h-[270px] max-w-md object-cover mx-auto"
          />

          {/* Heading */}
          <div className="w-[340px] h-[57px] font-open flex flex-col items-center justify-center text-center leading-tight mx-auto mt-4">
            <h2 className="font-bold text-2xl">
              Selamat datang di <span className="text-primary">SIRASA👋</span>
            </h2>
            <span className="text-xs">
              "Satu Portal Terintegrasi untuk Aset & Risiko"
            </span>
          </div>

          {/* Form login */}
          <div className="w-full max-w-md bg-white p-6 space-y-4 mx-auto">
            <InputLogin
              placeholder="Enter your email"
              name="email"
              type="email"
            />
            <InputLogin
              placeholder="Enter your password"
              name="password"
              type="password"
            />
            <BtnLogin />
          </div>
        </div>
      </div>

      <footer className="flex items-center justify-center h-16 py-10 mt-2">
        @ 2025 PT Cybera
      </footer>
    </div>
  );
}

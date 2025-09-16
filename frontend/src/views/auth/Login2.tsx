import BtnLogin from "../../components/button/BtnLogin";
import InputLogin from "../../components/input/InputLogin";

export default function Login() {
  return (
    <>
      {/* Navbar */}
      <nav>
        <img
          src="/login/logo.png"
          alt="sirasa"
          className="w-[75px] h-[27px] md:w-[118px] md:h-[40px] mx-5 md:mx-[30px] my-2 mb-5 md:mb-10"
        />
      </nav>

      {/* Container */}
      <div className="flex flex-col">
        {/* image login */}
        <div className="w-full mb-6">
          <img
            src="/login/icons.png"
            alt="logo login"
            className=" mx-auto md:w-[774px] md:h-[371px]"
          />
        </div>

        {/* form login */}
        <div className="font-open">
          <div className="text-center mb-6">
            <h1 className="font-bold text-2xl md:text-[38px] md:mb-6">
              Selamat datang di <span className="text-primary">SIRASA👋</span>
            </h1>
            <p className="font-medium text-[14px] md:text-[18px] md:mb-6">
              "Satu Portal Terintegrasi untuk Aset dan Resiko"
            </p>
          </div>

          <form action="" className="mb-6 px-5">
            <InputLogin
              placeholder="Masukkan email"
              name="email"
              type="email"
            />
            <InputLogin
              placeholder="Masukkan Password"
              name="password"
              type="password"
            />
            <BtnLogin />
          </form>
        </div>
      </div>

      {/* footer */}
      <footer className="flex items-center justify-center md:fixed md:bottom-[30px] md:left-1/2 md:text-[16px] md:-translate-x-1/2">
        @2025 PT Cybera
      </footer>
    </>
  );
}

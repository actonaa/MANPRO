import BtnLogin from "../../components/button/BtnLogin";
import InputLogin from "../../components/input/InputLogin";

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen lg:px-[40px]">
      {/* Navbar */}
      <nav className="lg:px-2">
        <img
          src="/login/logo.png"
          alt="sirasa"
          className="w-[75px] h-[27px] md:w-[118px] md:h-[40px] mx-5 md:mx-[30px] my-2 mb-5 md:mb-10"
        />
      </nav>

      {/* Container */}
      <div className="flex flex-col ">
        {/* image login */}
        <div className="w-full mb-6 lg:hidden">
          <img
            src="/login/icons.png"
            alt="logo login"
            className=" mx-auto md:w-[774px] md:h-[371px] "
          />
        </div>

        {/* form login */}
        <div className="lg:flex lg:justify-center lg:mt-10 lg:px-2">
          <div className="font-open lg:px-10 bg-accent">
            <div className="text-center mb-6">
              <h1 className="font-bold text-2xl md:text-[38px] md:mb-6 lg:mb-2">
                Selamat datang di <span className="text-primary">SIRASA👋</span>
              </h1>
              <p className="font-medium text-[14px] md:text-[18px] md:mb-6 lg:text-start">
                "Satu Portal Terintegrasi untuk Aset dan Resiko"
              </p>
            </div>

            <form action="" className="mb-6">
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
          <div className="lg:p-5 lg:pl-8 bg-red-300">
            <img
              src="/login/icons.png"
              alt="logo login"
              className=" hidden lg:block lg:w-[600px] h-[350px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="flex items-center mt-14 justify-center md:mt-auto md:mb-[30px] md:text-[16px]">
        @2025 PT Cybera
      </footer>
    </div>
  );
}

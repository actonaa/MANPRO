import Sidebar from "../../components/contanct/sidebar";
import BtnLogin from "../../components/button/BtnLogin";
import InputLogin from "../../components/input/InputLogin";

export default function Login() {
  return (
    <div className="flex">
      {/* Sidebar di kiri */}
      <Sidebar />

      {/* Konten Login di kanan */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
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
  );
}

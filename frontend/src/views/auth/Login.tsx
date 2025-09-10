import InputLogin from "../../components/input/InputLogin";

export default function Login() {
  return (
    <>
      <InputLogin placeholder=" Enter your email" name="email" type="email"/>
      <InputLogin placeholder=" Enter your password" name="password" type="password"/>
    </>
  );
}

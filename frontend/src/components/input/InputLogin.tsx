interface InputLoginProps {
    placeholder: string;
}

export default function InputLogin({placeholder}:InputLoginProps){
    return(
        
    <div className="flex items-center pt-1.5">
      <input className="mx-auto w-[400px] h-[47px] rounded-xl border-[1px] border-[#66666666]  px-1.5 placeholder:text-sm text-sm outline-none" type="email" name="email" id=""
      placeholder={placeholder} />
    </div>
    )
}
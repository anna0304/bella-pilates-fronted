import logo from "../../assets/logo.svg";

export function LoadingPage({ text = "Preparando tu experiencia..." }) {
  return (
    <div className="flex min-h-[320px] items-center justify-center rounded-[28px] border border-[#E8DDD3] bg-secondary p-10 shadow-sm">
      <div className="text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#EFE5DD]">
          <img src={logo} alt="Bella Pilates" className="h-12 w-12" />
        </div>

        <div className="mx-auto mt-6 h-2 w-32 overflow-hidden rounded-full bg-[#E8DDD3]">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>

        <p className="mt-5 font-medium text-[#2F2118]">{text}</p>
      </div>
    </div>
  );
}
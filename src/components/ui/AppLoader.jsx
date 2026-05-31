import logo from "../../assets/logo.svg";

export function AppLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8F3EE]">
      <div className="text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#EFE5DD] shadow-sm">
          <img
            src={logo}
            alt="Bella Pilates"
            className="h-16 w-16 animate-pulse"
          />
        </div>

        <h1 className="mt-6 text-3xl font-semibold text-[#2F2118]">
          Bella Pilates
        </h1>

        <p className="mt-2 text-[#6F5645]">
          Preparando tu experiencia...
        </p>
      </div>
    </div>
  );
}
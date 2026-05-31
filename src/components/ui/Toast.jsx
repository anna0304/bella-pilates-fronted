export function Toast({ message, visible }) {
  if (!visible) return null;

  return (
    <div className="fixed right-6 top-6 z-[9999] rounded-[18px] border border-[#E8DDD3] bg-secondary px-6 py-4 shadow-lg">
      <p className="font-medium text-[#2F2118]">{message}</p>
    </div>
  );
}
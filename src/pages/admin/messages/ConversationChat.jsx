import profileIcon from "../../../assets/perfil.svg";

export function ConversationChat({ conversation }) {
  if (!conversation) {
    return (
      <section className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 text-[#6F5645] shadow-sm">
        Selecciona un mensaje.
      </section>
    );
  }

  return (
    <section className="min-w-0 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
            <img src={profileIcon} alt="" className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h2 className="break-words font-semibold text-[#2F2118]">
              {conversation.userName}
            </h2>

            <p className="break-words text-sm text-[#6F5645]">
              {conversation.userEmail}
            </p>
          </div>
        </div>

        <span
          className={`w-fit rounded-full px-4 py-1 text-xs font-semibold ${
            conversation.archived
              ? "bg-[#EFEFEF] text-[#666666]"
              : conversation.unread > 0
                ? "bg-[#FFF1D8] text-[#D98300]"
                : "bg-[#E8F6EC] text-[#1F8A4C]"
          }`}
        >
          {conversation.status}
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4 text-sm text-[#8B6B52]">
        <div className="h-px flex-1 bg-[#E8DDD3]" />
        <span className="shrink-0">{conversation.date}</span>
        <div className="h-px flex-1 bg-[#E8DDD3]" />
      </div>

      <div className="mt-5 rounded-[18px] border border-[#E8DDD3] bg-white p-5">
        <p className="text-xs font-medium text-[#8B6B52]">Asunto</p>

        <h3 className="mt-2 break-words text-lg font-semibold text-[#2F2118]">
          {conversation.subject}
        </h3>
      </div>

      <div className="mt-5 space-y-4">
        {conversation.messages.map((item) => (
          <div key={item.id} className="rounded-[18px] border border-[#E8DDD3] bg-white p-5">
            <p className="whitespace-pre-line break-words text-sm leading-6 text-[#2F2118]">
              {item.text}
            </p>

            <p className="mt-3 text-right text-xs text-[#8B6B52]">
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
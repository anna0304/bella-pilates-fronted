import profileIcon from "../../../assets/perfil.svg";
import searchIcon from "../../../assets/lupa.svg";

export function ConversationList({
  conversations,
  selectedConversationId,
  search,
  setSearch,
  onSelectConversation,
}) {
  return (
    <aside className="min-w-0 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
      <div className="relative">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar mensaje..."
          className="h-[56px] w-full rounded-[14px] border border-[#E8DDD3] bg-white px-5 pr-12 outline-none transition focus:border-primary"
        />

        <img
          src={searchIcon}
          alt=""
          className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2"
        />
      </div>

      <div className="mt-5 max-h-[600px] overflow-y-auto divide-y divide-[#E8DDD3] pr-2">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversationId;

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              className={`flex w-full gap-3 px-3 py-4 text-left transition ${
                isSelected
                  ? "rounded-[18px] bg-[#FCF8F5]"
                  : "hover:bg-[#FCF8F5]"
              }`}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
                <img src={profileIcon} alt="" className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate font-semibold text-[#2F2118]">
                    {conversation.userName}
                  </p>

                  <span className="shrink-0 text-xs text-[#8B6B52]">
                    {conversation.time}
                  </span>
                </div>

                <p className="mt-1 truncate text-sm text-[#6F5645]">
                  {conversation.lastMessage}
                </p>
              </div>

              {conversation.unread > 0 && (
                <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
                  {conversation.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 border-t border-[#E8DDD3] pt-4">
        <p className="text-sm text-[#6F5645]">
          Mostrando {conversations.length} mensajes
        </p>
      </div>
    </aside>
  );
}
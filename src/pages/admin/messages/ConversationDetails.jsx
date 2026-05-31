import profileIcon from "../../../assets/perfil.svg";

export function ConversationDetails({
  conversation,
  onMarkUnread,
  onArchive,
  onUnarchive,
  onDelete,
}) {
  if (!conversation) {
    return (
      <aside className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 text-[#6F5645] shadow-sm">
        Sin mensaje seleccionado.
      </aside>
    );
  }

  return (
    <aside className="rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
      <div className="rounded-[18px] border border-[#E8DDD3] bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFE5DD]">
            <img src={profileIcon} alt="" className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="break-words font-semibold text-[#2F2118]">
              {conversation.userName}
            </p>

            <p className="break-words text-sm text-[#6F5645]">
              {conversation.userEmail}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h2 className="font-semibold text-[#2F2118]">Información</h2>

        <div className="mt-4 space-y-3 text-sm">
          <InfoRow label="Teléfono" value={conversation.phone} />
          <InfoRow label="Fecha" value={conversation.startedAt} />
          <InfoRow label="Estado" value={conversation.status} />
          <InfoRow label="Asignado a" value={conversation.assignedTo} />
        </div>
      </div>

      <div className="mt-5 border-t border-[#E8DDD3] pt-5">
        <h2 className="font-semibold text-[#2F2118]">Acciones rápidas</h2>

        <div className="mt-4 grid gap-3">
          <ActionButton onClick={onMarkUnread}>
            Marcar como no leído
          </ActionButton>

          {conversation.archived ? (
            <ActionButton onClick={onUnarchive}>Restaurar mensaje</ActionButton>
          ) : (
            <ActionButton onClick={onArchive}>Archivar mensaje</ActionButton>
          )}
          
          <button
            type="button"
            onClick={onDelete}
            className="w-full rounded-[14px] border border-red-200 px-5 py-3 font-semibold text-red-500 transition hover:bg-red-50"
          >
            Eliminar mensaje
          </button>
        </div>
      </div>
    </aside>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[#6F5645]">{label}</span>
      <span className="break-words text-right font-medium text-[#2F2118]">
        {value || "—"}
      </span>
    </div>
  );
}

function ActionButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-[14px] border border-[#E8DDD3] px-5 py-3 font-semibold text-[#2F2118] transition hover:border-primary hover:text-primary"
    >
      {children}
    </button>
  );
}

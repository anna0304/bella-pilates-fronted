import { useEffect, useMemo, useState } from "react";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { ConversationList } from "./ConversationList";
import { ConversationChat } from "./ConversationChat";
import { ConversationDetails } from "./ConversationDetails";

import {
  archiveAdminMessage,
  getAdminMessages,
  markAdminMessageAsRead,
  unarchiveAdminMessage,
  markAdminMessageAsUnread,
} from "../../../services/adminMessagesService";

function getData(response) {
  return response.data || response.messages || response || [];
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function mapMessageFromApi(message) {
  const isUnread = message.status === "unread";
  const isArchived = message.status === "archived";

  return {
    id: message.id,
    userName: message.name || "Sin nombre",
    userEmail: message.email || "Sin email",
    phone: message.phone || "—",
    subject: message.subject || "Sin asunto",
    time: formatTime(message.created_at),
    date: formatDate(message.created_at),
    unread: isUnread ? 1 : 0,
    status: isArchived ? "Archivada" : isUnread ? "No leída" : "Leída",
    archived: isArchived,
    assignedTo: "Admin",
    startedAt: `${formatDate(message.created_at)} ${formatTime(
      message.created_at,
    )}`,
    messagesTotal: 1,
    lastMessage: message.message || "",
    messages: [
      {
        id: message.id,
        sender: "user",
        text: message.message || "",
        time: formatTime(message.created_at),
      },
    ],
    internalNote: "",
    notes: [],
    raw: message,
  };
}

export function AdminMessagesPage() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todos");
  const [loadingMessages, setLoadingMessages] = useState(true);

  const [toast, setToast] = useState({
    visible: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({ visible: true, message });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 1800);
  };

  async function loadMessages() {
    try {
      setLoadingMessages(true);

      const response = await getAdminMessages();
      const data = getData(response);
      const mappedMessages = data.map(mapMessageFromApi);

      setConversations(mappedMessages);

      setSelectedConversationId((currentId) => {
        if (currentId && mappedMessages.some((item) => item.id === currentId)) {
          return currentId;
        }

        return mappedMessages[0]?.id || null;
      });
    } catch (error) {
      console.error(error);
      showToast("Error al cargar mensajes");
    } finally {
      setLoadingMessages(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        conversation.userName.toLowerCase().includes(searchValue) ||
        conversation.userEmail.toLowerCase().includes(searchValue) ||
        conversation.subject.toLowerCase().includes(searchValue) ||
        conversation.lastMessage.toLowerCase().includes(searchValue);

      const matchesTab =
        activeTab === "Todos" ||
        (activeTab === "No leídos" && conversation.unread > 0) ||
        (activeTab === "Archivados" && conversation.archived);

      return matchesSearch && matchesTab;
    });
  }, [conversations, search, activeTab]);

  const selectedConversation =
    conversations.find((item) => item.id === selectedConversationId) || null;

  const handleSelectConversation = async (id) => {
    setSelectedConversationId(id);

    const selected = conversations.find(
      (conversation) => conversation.id === id,
    );

    if (!selected || selected.unread === 0) return;

    try {
      await markAdminMessageAsRead(id);
      await loadMessages();
    } catch (error) {
      console.error(error);
      showToast("Error al marcar como leído");
    }
  };

  const handleSendMessage = () => {
    showToast("Responder mensajes requiere crear backend de respuestas");
  };

  const handleArchiveConversation = async () => {
    if (!selectedConversation) return;

    try {
      await archiveAdminMessage(selectedConversation.id);
      showToast("Mensaje archivado correctamente");
      await loadMessages();
    } catch (error) {
      console.error(error);
      showToast("Error al archivar mensaje");
    }
  };

  const handleUnarchiveConversation = async () => {
    if (!selectedConversation) return;

    try {
      await unarchiveAdminMessage(selectedConversation.id);
      showToast("Mensaje restaurado correctamente");
      await loadMessages();
    } catch (error) {
      console.error(error);
      showToast("Error al restaurar mensaje");
    }
  };

  const handleMarkUnread = async () => {
    if (!selectedConversation) return;

    try {
      await markAdminMessageAsUnread(selectedConversation.id);
      showToast("Mensaje marcado como no leído");
      await loadMessages();
    } catch (error) {
      console.error(error);
      showToast("Error al marcar como no leído");
    }
  };

  const handleDeleteConversation = () => {
    showToast("Eliminar mensajes no existe todavía en backend");
  };

  const handleSaveNote = () => {
    showToast("Notas internas requieren backend propio");
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#2F2118]">Mensajes</h1>

            <p className="mt-2 text-[#6F5645]">
              Gestiona los mensajes recibidos desde el formulario de contacto.
            </p>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto border-b border-[#E8DDD3]">
          <div className="flex min-w-max gap-8">
            {["Todos", "No leídos", "Archivados"].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-1 pb-4 text-sm font-medium transition ${
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-[#6F5645] hover:text-primary"
                }`}
              >
                {tab} ({getTabCount(tab, conversations)})
              </button>
            ))}
          </div>
        </div>

        {loadingMessages ? (
          <div className="mt-6 rounded-[24px] border border-[#E8DDD3] bg-secondary px-5 py-10 text-center text-[#6F5645]">
            Cargando mensajes...
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] 2xl:grid-cols-[320px_minmax(0,1fr)_300px]">
            <ConversationList
              conversations={filteredConversations}
              selectedConversationId={selectedConversation?.id}
              search={search}
              setSearch={setSearch}
              onSelectConversation={handleSelectConversation}
            />

            <ConversationChat
              conversation={selectedConversation}
              onSendMessage={handleSendMessage}
            />

            <ConversationDetails
              conversation={selectedConversation}
              onMarkUnread={handleMarkUnread}
              onArchive={handleArchiveConversation}
              onUnarchive={handleUnarchiveConversation}
              onDelete={handleDeleteConversation}
              onSaveNote={handleSaveNote}
            />
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

function getTabCount(tab, conversations) {
  if (tab === "Todos") return conversations.length;

  if (tab === "No leídos") {
    return conversations.filter((conversation) => conversation.unread > 0)
      .length;
  }

  if (tab === "Archivados") {
    return conversations.filter((conversation) => conversation.archived).length;
  }

  return 0;
}

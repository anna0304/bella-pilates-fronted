import { useEffect, useRef, useState } from "react";

import bellIcon from "../../assets/campana.svg";

const initialNotifications = [
  {
    id: 1,
    title: "Reserva confirmada",
    message: "Tu clase de Pilates Reformer está confirmada.",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: 2,
    title: "Nueva clase grabada",
    message: "Ya está disponible Pilates Flow - Energía.",
    time: "Hace 1 hora",
    read: false,
  },
  {
    id: 3,
    title: "Recordatorio",
    message: "Mañana tienes una clase a las 18:00.",
    time: "Ayer",
    read: true,
  },
];

export function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const markAsRead = (id) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((item) => ({
        ...item,
        read: true,
      })),
    );
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-secondary transition hover:bg-[#EFE5DD]"
      >
        <img src={bellIcon} alt="Notificaciones" className="h-5 w-5" />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 z-50 w-[340px] rounded-[22px] border border-[#E8DDD3] bg-secondary p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[#2F2118]">
              Notificaciones
            </h3>

            <button
              type="button"
              onClick={markAllAsRead}
              className="text-sm font-medium text-primary transition hover:opacity-70"
            >
              Marcar todas
            </button>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => markAsRead(notification.id)}
                className={`w-full rounded-[16px] border p-4 text-left transition hover:border-primary ${
                  notification.read
                    ? "border-[#E8DDD3] bg-white"
                    : "border-primary/30 bg-[#FCF8F5]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-[#2F2118]">
                      {notification.title}
                    </h4>

                    <p className="mt-1 text-sm leading-relaxed text-[#6F5645]">
                      {notification.message}
                    </p>

                    <span className="mt-2 block text-xs text-[#8B6B52]">
                      {notification.time}
                    </span>
                  </div>

                  {!notification.read && (
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

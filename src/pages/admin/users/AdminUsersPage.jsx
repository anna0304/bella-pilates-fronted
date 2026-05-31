import { useEffect, useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { AdminLayout } from "../../../components/admin/AdminLayout";
import { Toast } from "../../../components/ui/Toast";

import { UserStatsCards } from "./UserStatsCards";
import { UserFilters } from "./UserFilters";
import { UserRow } from "./UserRow";
import { CreateUserModal } from "./CreateUserModal";
import { EditUserModal } from "./EditUserModal";
import { ViewUserModal } from "./ViewUserModal";
import { ResetPasswordModal } from "./ResetPasswordModal";

import {
  createAdminUser,
  deactivateAdminUser,
  getAdminUsers,
  resetAdminUserPassword,
  updateAdminUser,
} from "../../../services/adminUsersService";

const ITEMS_PER_PAGE = 5;

function formatDate(date) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("es-ES");
}

function mapRole(role) {
  if (role === "admin") return "Administrador";
  if (role === "instructor") return "Instructor";
  return "Usuario";
}

function mapStatus(user) {
  if (user.status === "active" || user.is_active === true) return "Activo";
  return "Inactivo";
}

function splitFullName(fullName) {
  const parts = fullName.trim().split(" ");

  return {
    name: parts[0] || "",
    surname: parts.slice(1).join(" ") || "Sin apellido",
  };
}

function mapUserFromApi(user) {
  return {
    id: user.id,
    name: [user.name, user.surname].filter(Boolean).join(" ") || user.name,
    email: user.email,
    role: mapRole(user.role),
    status: mapStatus(user),
    registerDate: formatDate(user.created_at),
    lastAccess: user.last_login_at ? formatDate(user.last_login_at) : "—",
    phone: user.phone || "Sin teléfono",
    plan: user.plan || "Sin plan",
    reservations: user.reservations_count || 0,
    favorites: user.favorites_count || 0,
    raw: user,
  };
}

function mapRoleToApi(role) {
  if (role === "Administrador") return "admin";
  if (role === "Instructor") return "instructor";
  return "user";
}

function mapStatusToApi(status) {
  return status === "Activo" ? "active" : "inactive";
}

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [resetPasswordUser, setResetPasswordUser] = useState(null);
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);

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

  async function loadUsers() {
    try {
      setLoadingUsers(true);

      const response = await getAdminUsers();

      const usersData = Array.isArray(response)
        ? response
        : response.data || response.users || [];

      setUsers(usersData.map(mapUserFromApi));
    } catch (error) {
      console.error(error);
      showToast("Error al cargar usuarios");
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        user.name.toLowerCase().includes(searchValue) ||
        user.email.toLowerCase().includes(searchValue);

      const matchesRole = roleFilter === "Todos" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "Todos" || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, statusFilter]);

  const handleExportPdf = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Usuarios - Bella Pilates", 14, 18);

    doc.setFontSize(10);
    doc.text(`Total exportado: ${filteredUsers.length}`, 14, 26);

    autoTable(doc, {
      startY: 34,
      head: [["Nombre", "Email", "Rol", "Estado", "Registro", "Último acceso"]],
      body: filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.registerDate,
        user.lastAccess,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [143, 91, 63],
      },
    });

    doc.save("usuarios-bella-pilates.pdf");
    showToast("PDF exportado correctamente");
  };

  const handleCreateUser = async (newUser) => {
    try {
      const { name, surname } = splitFullName(newUser.name);

      const payload = {
        name,
        surname,
        email: newUser.email,
        role: mapRoleToApi(newUser.role),
        status: mapStatusToApi(newUser.status),
      };

      await createAdminUser(payload);

      setIsCreateModalOpen(false);
      showToast("Usuario creado correctamente");

      await loadUsers();
    } catch (error) {
      console.error(error);
      showToast("Error al crear usuario");
    }
  };

  const handleEditUser = async (updatedUser) => {
    try {
      const { name, surname } = splitFullName(updatedUser.name);

      const payload = {
        name,
        surname,
        email: updatedUser.email,
        role: mapRoleToApi(updatedUser.role),
        status: mapStatusToApi(updatedUser.status),
      };

      await updateAdminUser(updatedUser.id, payload);

      setEditingUser(null);
      showToast("Usuario actualizado correctamente");

      await loadUsers();
    } catch (error) {
      console.error(error);
      showToast("Error al actualizar usuario");
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await deactivateAdminUser(userId);

      showToast("Estado del usuario actualizado");

      await loadUsers();
    } catch (error) {
      console.error(error);
      showToast("Error al cambiar estado");
    }
  };

  const handleResetPassword = async (user) => {
    try {
      const response = await resetAdminUserPassword(user.id);

      setResetPasswordUser(user);

      setTemporaryPassword(
        response.temporary_password || response.password || "No disponible",
      );

      showToast("Contraseña temporal generada correctamente");
    } catch (error) {
      console.error(error);
      showToast("Error al resetear contraseña");
    }
  };

  return (
    <AdminLayout>
      <Toast visible={toast.visible} message={toast.message} />

      <section className="mt-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-[#2F2118]">Usuarios</h1>

            <p className="mt-2 text-[#6F5645]">
              Gestiona los usuarios registrados en el sistema.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={handleExportPdf}
              className="rounded-[14px] border border-[#E8DDD3] bg-white px-6 py-4 font-semibold text-primary transition hover:bg-[#FCF8F5]"
            >
              Exportar PDF
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-[14px] bg-primary px-6 py-4 font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              + Nuevo usuario
            </button>
          </div>
        </div>

        <UserStatsCards users={users} />

        <div className="mt-6 rounded-[24px] border border-[#E8DDD3] bg-secondary p-5 shadow-sm">
          <UserFilters
            search={search}
            setSearch={setSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <div className="mt-6 grid gap-4 xl:hidden">
            {loadingUsers ? (
              <EmptyState text="Cargando usuarios..." />
            ) : paginatedUsers.length === 0 ? (
              <EmptyState text="No hay usuarios para mostrar." />
            ) : (
              paginatedUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onView={() => setViewingUser(user)}
                  onEdit={() => setEditingUser(user)}
                  onToggleStatus={() => handleToggleStatus(user.id)}
                  onResetPassword={handleResetPassword}
                />
              ))
            )}
          </div>

          <div className="mt-6 hidden overflow-hidden xl:block">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#FCF8F5] text-left text-sm text-[#2F2118]">
                  <th className="rounded-l-[14px] px-4 py-4 font-semibold">
                    Usuario
                  </th>
                  <th className="px-4 py-4 font-semibold">Email</th>
                  <th className="px-4 py-4 font-semibold">Rol</th>
                  <th className="px-4 py-4 font-semibold">Estado</th>
                  <th className="px-4 py-4 font-semibold">
                    Fecha de registro
                  </th>
                  <th className="rounded-r-[14px] px-4 py-4 font-semibold">
                    Acciones
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E8DDD3]">
                {loadingUsers ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : paginatedUsers.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-10 text-center text-[#6F5645]"
                    >
                      No hay usuarios para mostrar.
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      onView={() => setViewingUser(user)}
                      onEdit={() => setEditingUser(user)}
                      onToggleStatus={() => handleToggleStatus(user.id)}
                      onResetPassword={handleResetPassword}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-4 text-sm text-[#6F5645] md:flex-row md:items-center md:justify-between">
            <p>
              Mostrando {paginatedUsers.length} de {filteredUsers.length}{" "}
              usuarios
            </p>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </div>
        </div>
      </section>

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateUser}
      />

      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={handleEditUser}
      />

      <ViewUserModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onEdit={(user) => {
          setViewingUser(null);
          setEditingUser(user);
        }}
      />

      <ResetPasswordModal
        user={resetPasswordUser}
        temporaryPassword={temporaryPassword}
        onClose={() => {
          setResetPasswordUser(null);
          setTemporaryPassword("");
        }}
      />
    </AdminLayout>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-[18px] border border-[#E8DDD3] bg-white px-5 py-10 text-center text-[#6F5645]">
      {text}
    </div>
  );
}

function UserCard({
  user,
  onView,
  onEdit,
  onToggleStatus,
  onResetPassword,
}) {
  const isActive = user.status === "Activo";
  const isAdmin = user.role === "Administrador";

  return (
    <article className="rounded-[20px] border border-[#E8DDD3] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-[#2F2118]">
            {user.name}
          </h3>

          <p className="mt-1 break-words text-sm text-[#6F5645]">
            {user.email}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full px-4 py-1 text-xs font-semibold ${
                isAdmin
                  ? "bg-[#F1E5F8] text-[#7A3FA0]"
                  : "bg-[#F8EADF] text-primary"
              }`}
            >
              {user.role}
            </span>

            <button
              type="button"
              onClick={onToggleStatus}
              className={`rounded-full px-4 py-1 text-xs font-semibold ${
                isActive
                  ? "bg-[#E8F6EC] text-[#1F8A4C]"
                  : "bg-[#FDECEC] text-[#D64545]"
              }`}
            >
              {user.status}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Info label="Fecha registro" value={user.registerDate} />
        <Info label="Teléfono" value={user.phone} />
        <Info label="Plan" value={user.plan} />
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2">
        <button
          type="button"
          onClick={onView}
          className="rounded-[12px] border border-[#E8DDD3] px-4 py-2 font-semibold text-primary transition hover:bg-[#FCF8F5]"
        >
          Ver
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="rounded-[12px] bg-primary px-4 py-2 font-semibold text-white transition hover:opacity-90"
        >
          Editar
        </button>

        <button
          type="button"
          onClick={() => onResetPassword(user)}
          className="rounded-[12px] border border-[#E8DDD3] px-4 py-2 font-semibold text-[#5A4030] transition hover:bg-[#FCF8F5]"
        >
          Resetear contraseña
        </button>
      </div>
    </article>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs font-medium text-[#8B6B52]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[#2F2118]">
        {value || "—"}
      </p>
    </div>
  );
}

function Pagination({ currentPage, totalPages, setCurrentPage }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((page) => page - 1)}
        className="rounded-[10px] border border-[#E8DDD3] px-4 py-2 disabled:opacity-40"
      >
        ‹
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const page = index + 1;

        return (
          <button
            key={page}
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`rounded-[10px] px-4 py-2 ${
              currentPage === page
                ? "bg-primary text-white"
                : "border border-[#E8DDD3]"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((page) => page + 1)}
        className="rounded-[10px] border border-[#E8DDD3] px-4 py-2 disabled:opacity-40"
      >
        ›
      </button>
    </div>
  );
}
import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { DetailHeader } from "./common/DetailHeader";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "./AppRoutes";
import { User, UserRoles } from "@/types";
import { Trash2, UserPlus } from "lucide-react";
import { CreateUserModal } from "./CreateUserModal";
import { useAppDispatch } from "@/store/hooks";
import { deleteUserThunk } from "@/store/slices/authSlice";
import DeleteDialog from "./common/DeleteDialog";

export const UsersView: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    users,
    role,
    user: currentUsername,
  } = useAppSelector((state) => state.auth);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openDltDlg, setOpenDltDlg] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  if (role !== UserRoles.Master && role !== UserRoles.Admin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <h1 className="text-2xl font-bold text-red-400">Access Denied</h1>
        <p className="mt-2">You do not have permission to access this page.</p>
        <button
          onClick={() => navigate(ROUTES.HOME)}
          className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleDelete = () => {
    if (selectedUser.username !== currentUsername)
      dispatch(deleteUserThunk(selectedUser?.userId));
  };

  return (
    <div className="table-view-wrapper">
      <DetailHeader
        label="Administration"
        title="User Management"
        onBack={() => navigate(ROUTES.HOME)}
      />

      <div className="table-view-content">
        <div className="table-view-inner-content">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">System Users</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/30"
            >
              <UserPlus className="w-4 h-4" />
              Create New User
            </button>
          </div>

          {/* User table */}
          <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-700">
                  <th className="px-6 py-4 text-slate-400 font-semibold uppercase text-xs tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-slate-400 font-semibold uppercase text-xs tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-4 text-slate-400 font-semibold uppercase text-xs tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-slate-400 font-semibold uppercase text-xs tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-slate-400 font-semibold uppercase text-xs tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((u: User) => (
                  <tr
                    key={u.userId}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-300 font-mono">
                      {u.userId}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {u.username}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          u.role === UserRoles.Master
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-green-400 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {role === UserRoles.Master &&
                        u.role !== UserRoles.Master && (
                          <button
                            onClick={() => {
                              setSelectedUser(u);
                              setOpenDltDlg(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {showCreateModal && (
        <CreateUserModal onClose={() => setShowCreateModal(false)} />
      )}

      <DeleteDialog
        open={openDltDlg}
        setOpen={setOpenDltDlg}
        msg={`Are you sure you want to delete '${selectedUser?.username}'?`}
        title="Delete User"
        onDelete={handleDelete}
      />
    </div>
  );
};

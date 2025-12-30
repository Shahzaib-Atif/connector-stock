import React, { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { DetailHeader } from "../common/DetailHeader";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../AppRoutes";
import { User, UserRoles } from "@/types";
import { Trash2, UserPlus } from "lucide-react";
import { CreateUserModal } from "../CreateUserModal";
import { useAppDispatch } from "@/store/hooks";
import { deleteUserThunk } from "@/store/slices/authSlice";
import DeleteDialog from "../common/DeleteDialog";
import UsersTable from "./UsersTable";

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

      {/* Content */}
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
          <UsersTable
            setOpenDltDlg={setOpenDltDlg}
            setSelectedUser={setSelectedUser}
          />
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal onClose={() => setShowCreateModal(false)} />
      )}

      {/* Delete Dialog Modal */}
      {selectedUser && (
        <DeleteDialog
          open={openDltDlg}
          setOpen={setOpenDltDlg}
          msg={`Are you sure you want to delete '${selectedUser?.username}'?`}
          title="Delete User"
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

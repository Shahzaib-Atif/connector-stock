import React, { useState } from "react";
import { X, UserPlus, Loader2, CheckCircle2, Building2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createUserThunk } from "@/store/slices/authSlice";
import ShowSucess from "./common/ShowSucess";
import { UserRoles } from "@/utils/types/userTypes";
import { Department } from "@/utils/types/shared";

interface Props {
  onClose: () => void;
}

export const CreateUserModal: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const currentUserRole = useAppSelector((state) => state.auth.role);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRoles>(UserRoles.User);
  const [dept, setDept] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await dispatch(
        createUserThunk({
          userId: 0,
          username,
          password,
          role,
          dept: dept || undefined,
        })
      ).unwrap();
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create user");
      setStatus("error");
    }
  };

  const availableRoles =
    currentUserRole === UserRoles.Master
      ? [UserRoles.Admin, UserRoles.User]
      : [UserRoles.User];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">
              Create New User
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {status === "success" ? (
            <ShowSucess title="User Created!" message="Refreshing list..." />
          ) : (
            <>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                >
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  autoComplete="username"
                  onChange={(e) => setUsername(e.target.value)}
                  className={inputClass}
                  placeholder="Enter username"
                  required
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete="current-password"
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter initial password"
                  required
                />
              </div>

              {/* Role field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-slate-400 mb-1.5"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRoles)}
                  className={inputClass + " appearance-none cursor-pointer"}
                  required
                >
                  {availableRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department field */}
              <div className="space-y-2">
                <label
                  htmlFor="dept"
                  className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1 flex items-center gap-2"
                >
                  <Building2 className="w-3 h-3" />
                  Department
                </label>
                <div className="relative">
                  <select
                    id="dept"
                    value={dept}
                    onChange={(e) => setDept(e.target.value)}
                    className={inputClass + " appearance-none cursor-pointer"}
                  >
                    <option value="">No Department</option>
                    {Object.values(Department).map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {status === "error" && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-400 text-center">
                    {errorMessage}
                  </p>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

const inputClass =
  "w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 " +
  "focus:border-blue-500 outline-none transition-all";

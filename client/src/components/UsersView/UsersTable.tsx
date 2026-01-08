import { useAppSelector } from "@/store/hooks";
import { User, UserRoles } from "@/utils/types/userTypes";
import { Trash2 } from "lucide-react";
import React from "react";

interface Props {
  setSelectedUser: React.Dispatch<React.SetStateAction<User>>;
  setOpenDltDlg: React.Dispatch<React.SetStateAction<boolean>>;
}

function UsersTable({ setSelectedUser, setOpenDltDlg }: Props) {
  const { users, role } = useAppSelector((state) => state.auth);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-auto">
      <table className="w-full text-left">
        {/* Table Header */}
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
              Dept
            </th>
            <th className="px-6 py-4 text-slate-400 font-semibold uppercase text-xs tracking-wider text-right">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-700">
          {users.map((u: User) => (
            <tr
              key={u.userId}
              className="hover:bg-slate-700/50 transition-colors"
            >
              <td className="px-6 py-4 text-slate-300 font-mono">{u.userId}</td>
              <td className="px-6 py-4 text-white font-medium">{u.username}</td>
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
              <td className="px-6 py-4 text-slate-300">{u.dept || "--"}</td>
              <td className="px-6 py-4 text-right">
                {role === UserRoles.Master && u.role !== UserRoles.Master && (
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
  );
}

export default UsersTable;

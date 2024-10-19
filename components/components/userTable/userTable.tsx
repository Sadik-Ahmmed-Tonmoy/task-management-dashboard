// components/userTable.tsx

import StatusBadge from "@/app/(defaults)/components/StatusBadge";


interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
  level: number;
  isActive: boolean;
  lastClaimDate: string;
  createdAt: string;
}

interface Props {
  users: User[];
}

const UserTable: React.FC<Props> = ({ users }) => {
  return (
    <table className="min-w-full border-collapse border">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="p-4 text-left">Email</th>
          <th className="p-4 text-left">Username</th>
          <th className="p-4 text-left">Role</th>
          <th className="p-4 text-left">Level</th>
          <th className="p-4 text-left">Active</th>
          <th className="p-4 text-left">Last Claim Date</th>
          <th className="p-4 text-left">Created At</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
          <tr key={user._id} className="border-b">
            <td className="p-4">{user.email}</td>
            <td className="p-4">{user.username}</td>
            <td className="p-4">{user.role}</td>
            <td className="p-4">{user.level}</td>
            <td className="p-4">
              <StatusBadge isActive={user.isActive} />
            </td>
            <td className="p-4">{new Date(user.lastClaimDate).toLocaleDateString()}</td>
            <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

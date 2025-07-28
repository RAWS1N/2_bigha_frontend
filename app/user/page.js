'use client';

import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [userStates, setUserStates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get("/user");
        const fetchedUsers = res.data.data;
        setUsers(fetchedUsers);

        // Pre-fill userStates with current status
        const initialStates = {};
        fetchedUsers.forEach(user => {
          initialStates[user.id] = user.status || "";
        });
        setUserStates(initialStates);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (userId, state) => {
    setUserStates(prev => ({ ...prev, [userId]: state }));
  };

  const handleSubmit = async (userId) => {
    const selectedState = userStates[userId];
    try {
      await axiosInstance.put(`/user/${userId}`, { status: selectedState });

      // Optimistically update the users array
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status: selectedState } : user
        )
      );

      alert("User status updated!");
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };


  const handleDelete = async (userId) => {
    const selectedState = userStates[userId];
    try {
      await axiosInstance.delete(`/user/${userId}`);

      // Optimistically update the users array
      setUsers(prev =>
        prev.filter(user =>
          user.id !== userId
        )
      );

      alert("User has been deleted");
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  };

  const filteredUsers = users.filter(user =>
    [user.first_name, user.email, user.phone_number]
      .some(field =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <input
        type="text"
        placeholder="Search by name, email or phone"
        className="w-full mb-6 px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="space-y-5">
        {filteredUsers.map(user => (
          <div
            key={user.id}
            className="p-4 bg-white border rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <p className="text-lg font-semibold">{user.first_name} {user.last_name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-600">{user.phone_number}</p>
              <p className="mt-1 text-sm">
                <strong>Status:</strong> <span className="capitalize">{user.status}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                className="border rounded-md px-3 py-1 text-sm"
                value={userStates[user.id] || ""}
                onChange={(e) => handleChange(user.id, e.target.value)}
              >
                <option value="">Change status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 text-sm"
                onClick={() => handleSubmit(user.id)}
              >
                Update
              </button>

              <button
                className="bg-red-600 text-white px-4 py-1.5 rounded-md hover:bg-red-700 text-sm"
                onClick={() => handleDelete(user.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;

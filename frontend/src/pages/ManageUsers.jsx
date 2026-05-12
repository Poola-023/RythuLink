import { useEffect, useState }
from "react";

import {
    getUsers,
    deleteUser
}
from "../services/adminService";

function ManageUsers() {

    const [users, setUsers] =
        useState([]);

    useEffect(() => {

        fetchUsers();

    }, []);

    const fetchUsers = async () => {

        try {

            const response =
                await getUsers();

            setUsers(response.data);

        } catch (error) {

            console.log(error);
        }
    };

    const handleDelete = async (
        id
    ) => {

        try {

            await deleteUser(id);

            alert("User Deleted");

            fetchUsers();

        } catch (error) {

            console.log(error);
        }
    };

    return (

        <div className="min-h-screen bg-green-100 p-10">

            <h1 className="text-4xl font-bold text-green-700 mb-10">
                Manage Users 👨‍🌾
            </h1>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">

                <table className="w-full">

                    <thead className="bg-green-700 text-white">

                        <tr>

                            <th className="p-4">
                                ID
                            </th>

                            <th className="p-4">
                                Name
                            </th>

                            <th className="p-4">
                                Email
                            </th>

                            <th className="p-4">
                                Role
                            </th>

                            <th className="p-4">
                                Action
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="text-center border-b"
                                >

                                    <td className="p-4">
                                        {user.id}
                                    </td>

                                    <td className="p-4">
                                        {user.name}
                                    </td>

                                    <td className="p-4">
                                        {user.email}
                                    </td>

                                    <td className="p-4">
                                        {user.role}
                                    </td>

                                    <td className="p-4">

                                        <button
                                            onClick={() =>
                                                handleDelete(user.id)
                                            }
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default ManageUsers;
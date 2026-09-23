import React, {
  useEffect,
  useState,
} from "react";

import { useAuth }
from "../context/AuthContext";

const AdminDashboard = () => {

  const { token } = useAuth();

  const [stats, setStats] =
    useState({});

  const [orders, setOrders] =
    useState([]);

  useEffect(() => {

    fetch(
      "/api/admin/stats",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then(setStats);

    fetch(
      "/api/admin/orders",
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then(setOrders);

  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            Users
          </h3>

          <p className="text-3xl font-bold">
            {stats.users || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            Medicines
          </h3>

          <p className="text-3xl font-bold">
            {stats.medicines || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            Orders
          </h3>

          <p className="text-3xl font-bold">
            {stats.orders || 0}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h3 className="text-gray-500">
            Prescriptions
          </h3>

          <p className="text-3xl font-bold">
            {stats.prescriptions || 0}
          </p>
        </div>

      </div>

      {/* Orders */}

      <div className="bg-white rounded-xl shadow">

        <div className="p-5 border-b">
          <h2 className="text-xl font-bold">
            Recent Orders
          </h2>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-gray-50">

                <th className="p-3 text-left">
                  Order ID
                </th>

                <th className="p-3 text-left">
                  Customer
                </th>

                <th className="p-3 text-left">
                  Email
                </th>

                <th className="p-3 text-left">
                  Amount
                </th>

                <th className="p-3 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {Array.isArray(orders) &&
  orders.map((order) => (

                  <tr
                    key={order.id}
                    className="border-b"
                  >

                    <td className="p-3">
                      #{order.id}
                    </td>

                    <td className="p-3">
                      {order.name}
                    </td>

                    <td className="p-3">
                      {order.email}
                    </td>

                    <td className="p-3">
                      ₹
                      {order.total_amount}
                    </td>

                    <td className="p-3">

                      <span
                        className="
                        bg-blue-100
                        text-blue-700
                        px-3
                        py-1
                        rounded-full
                        text-sm
                      "
                      >
                        {order.status}
                      </span>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );

};

export default AdminDashboard;
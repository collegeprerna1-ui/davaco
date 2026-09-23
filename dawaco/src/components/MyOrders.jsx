import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const steps = [
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];

const MyOrders = () => {
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold mb-6">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-500">
          No orders found.
        </p>
      ) : (
        orders.map((order) => {
          const currentStep =
            steps.indexOf(order.status);

          return (
            <div
              key={order.id}
              className="border rounded-xl p-5 mb-6"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold">
                    Order #{order.id}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {order.created_at}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-green-600">
                    ₹{order.total_amount}
                  </p>

                  <p className="text-sm font-medium text-blue-600">
                    {order.status}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between">
                  {steps.map((step, index) => (
                    <div
                      key={step}
                      className="flex flex-col items-center flex-1"
                    >
                      <div
                        className={`w-5 h-5 rounded-full
                        ${
                          index <= currentStep
                            ? "bg-green-500"
                            : "bg-gray-300"
                        }`}
                      />

                      <span className="text-[10px] text-center mt-2">
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default MyOrders;
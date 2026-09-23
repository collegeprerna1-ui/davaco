import { useAuth } from "../context/AuthContext";
import MyOrders from "../components/MyOrders";
import AdminDashboard from "./AdminDashboard";

function MyProfile() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">My Profile</h1>

      {user?.role === "admin" ? (
        <AdminDashboard />
      ) : (
        <MyOrders />
      )}
    </div>
  );
}

export default MyProfile;
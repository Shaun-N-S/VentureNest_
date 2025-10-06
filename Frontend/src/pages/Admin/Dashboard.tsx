import AdminLayout from "../../layouts/AdminLayout";

const Dashboard = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded shadow">Total Users: 50</div>
        <div className="p-6 bg-white rounded shadow">Total Investors: 20</div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

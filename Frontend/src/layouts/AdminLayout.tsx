import { Outlet } from "react-router-dom";
import Navbar from "../components/bar/Navbar";

const AdminLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar role="ADMIN" />
            <main className="pt-20 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;

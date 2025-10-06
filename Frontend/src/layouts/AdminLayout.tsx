import type { ReactNode } from "react";
import Navbar from "../components/bar/Navbar";
import type React from "react";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar role="ADMIN" />
            <main className="p-6">{children}</main>
        </div>
    );
};

export default AdminLayout;

import { Outlet } from "react-router-dom";
import Navbar from "../components/bar/Navbar";

const InvestorLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar role="INVESTOR" />
            <main className="pt-20 p-6">
                <Outlet />
            </main>
        </div>
    );
};

export default InvestorLayout;

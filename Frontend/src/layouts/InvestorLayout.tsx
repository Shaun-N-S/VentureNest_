import { Outlet } from "react-router-dom";
import Navbar from "../components/bar/Navbar";
import Footer from "../components/bar/Footer";

const InvestorLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Navbar />
            <main className="pt-20 p-6 flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default InvestorLayout;

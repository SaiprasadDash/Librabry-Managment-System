import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

function MemberLayout() {
    return (
        <div className="admin-layout">
            <Header />
            <div className="admin-body">
                <Sidebar />
                <main className="admin-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default MemberLayout;

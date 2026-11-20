import Header from "../member/inc/Header";

function AdminDashboard() {
    return (
        <div className="dashboard-page">
            <Header />
            <main className="dashboard-content">
                <div className="dashboard-welcome">
                    <h1>Admin Dashboard</h1>
                    <p>Welcome to the library administration portal</p>
                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;

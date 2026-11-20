import Header from "../member/inc/Header";

function LibrarianDashboard() {
    return (
        <div className="dashboard-page">
            <Header />
            <main className="dashboard-content">
                <div className="dashboard-welcome">
                    <h1>Librarian Dashboard</h1>
                    <p>Welcome to the library management portal</p>
                </div>
            </main>
        </div>
    );
}

export default LibrarianDashboard;

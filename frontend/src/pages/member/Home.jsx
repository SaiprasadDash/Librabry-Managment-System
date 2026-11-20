import Header from "./inc/Header";

function Home() {
    return (
        <div className="home-page">
            <Header />
            <main className="home-content">
                <div className="home-welcome">
                    <h1>Welcome to Library Management System</h1>
                    <p>Your one-stop solution for managing books and library resources.</p>
                </div>
            </main>
        </div>
    );
}

export default Home;

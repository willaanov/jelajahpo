import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login")
    }
    return (
        <nav className="navbar navbar-dark bg-dark px-3">
            <Link to="/" className="navbar-brand"> JelajahPo 📸</Link>
            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
        </nav>
    );
}

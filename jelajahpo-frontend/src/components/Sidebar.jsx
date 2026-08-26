import { Link } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="bg-light p-3 border-end col-3 min-vh-100">
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/wisata" className="btn text-start w-100">Wisata</Link>
                </li>
                <li className="nav-item">
                    <Link to="/kategori" className="btn text-start w-100">Kategori</Link>
                </li>
            </ul>
        </div>
    );
}

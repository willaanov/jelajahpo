import { useEffect, useState } from "react";

export default function Kategori() {
    const [kategori, setKategori] = useState([]);
    const [loading, setLoading] = useState(true);

    const getKategori = async () => {
        try {
            const res = await fetch("http://localhost:3001/kategori");
            const data = await res.json();
            setKategori(data);
        } catch {
            console.error("Gagal fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getKategori();
    }, []);

    if (loading) {
        return <div className="container mt-4">Sedang memuat data...</div>
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Daftar Kategori JelajahPo</h2>
            </div>

            <table className="table table-bondered table-striped">
                <thead className="table-primary">
                    <tr>
                        <th>Id</th>
                        <th>Kategori</th>
                    </tr>
                </thead>
                <tbody>
                    {kategori.length > 0 ? (
                        kategori.map((item) => (
                            <tr key={item.id_kategori}>
                                <td>{item.id_kategori}</td>
                                <td>{item.kategori}</td>
                            </tr>
                        ))
                    ) : ( 
                        <tr>
                            <td colSpan="2" className="text-center">
                                Belum ada wisata
                            </td>
                        </tr>
                    )}
                 </tbody>
            </table>
        </div>
    )
}
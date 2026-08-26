import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Wisata from "./pages/Wisata";
import Kategori from "./pages/Kategori";
import AddWisata from "./pages/AddWisata";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wisata" element={<Wisata />} />
          <Route path="kategori" element={<Kategori />} />
          <Route path="wisata/tambah" element={<AddWisata />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
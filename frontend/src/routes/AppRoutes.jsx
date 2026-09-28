import { BrowserRouter, Route, Routes } from "react-router-dom";
import About from "../pages/About.jsx";
import Home from "../pages/Home.jsx";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

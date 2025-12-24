import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar"; // Importe sua Navbar aqui

import "../style.css";

export function MainLayout() {
  return (
    <div className="app-container min-h-screen bg-indigo-50/30">
      <header>
        <Navbar />
      </header>

      <main style={{ padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}

import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/mainLayout";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/perfil";
import StudentsPage from "./pages/alunos";
import LogsPage from "./pages/logs";
import CodePage from "./pages/qrcode";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/alunos" element={<StudentsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/qrcode" element={<CodePage />} />
      </Route>
    </Routes>
  );
}

export default App;

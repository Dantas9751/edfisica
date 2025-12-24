import { Routes, Route } from "react-router-dom";
import { MainLayout } from "./layouts/mainLayout";
import LoginPage from "./pages/login";
import HomePage from "./pages/home";
import ProfilePage from "./pages/perfil";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/perfil" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;

import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

function LoginPage() {
  const [matricula, setMatricula] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(matricula, password);
    } catch {
      setError("Matrícula ou senha inválida");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input
        value={matricula}
        onChange={(e) => setMatricula(e.target.value)}
        placeholder="Matrícula"
        autoComplete="matricula"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        autoComplete="password"
      />

      <button type="submit">Entrar</button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default LoginPage;

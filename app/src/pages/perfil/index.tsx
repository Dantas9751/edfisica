import { useAuth } from "../../hooks/useAuth";

function ProfilePage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl">{user?.name}</h1>
      <h1 className="text-1xl">Matrícula: {user?.matricula}</h1>
      <h1 className="text-1xl">Tokens Restantes: {user?.qtd_token}</h1>
    </div>
  );
}

export default ProfilePage;

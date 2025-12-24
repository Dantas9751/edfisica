import { Link } from "react-router-dom";
import { Bolt } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

function Navbar() {
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
  };
  const { user } = useAuth();

  return (
    <div className="w-full">
      <nav className="bg-linear-to-r from-cyan-50 to-teal-100 p-4 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex-1"></div>

          <ul className="flex gap-8 font-medium text-gray-800 flex-1 justify-center">
            <li>
              <Link
                to="/home"
                className="hover:text-emerald-600 transition-colors"
              >
                Início
              </Link>
            </li>
            <li>
              <Link
                to="/perfil"
                className="hover:text-emerald-600 transition-colors"
              >
                Perfil
              </Link>
            </li>
            <ul>
              {!user?.isAdm && (
                <div className="flex gap-8 font-medium text-gray-800 flex-1 justify-center">
                  <li>
                    <Link
                      to="/qrcode"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Scanner
                    </Link>
                  </li>
                </div>
              )}
            </ul>

            <ul>
              {user?.isAdm && (
                <div className="flex gap-8 font-medium text-gray-800 flex-1 justify-center">
                  <li>
                    <Link
                      to="/alunos"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Alunos
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/logs"
                      className="hover:text-emerald-600 transition-colors"
                    >
                      Logs
                    </Link>
                  </li>
                </div>
              )}
            </ul>
          </ul>

          <div className="flex-1 flex justify-end">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="settings-button text-emerald-900 hover:text-emerald-600"
              >
                <Bolt />
              </div>
              <ul
                tabIndex={-1}
                className="dropdown-content menu bg-emerald-100 rounded-box z-10 w-52 p-2 shadow-lg mt-4"
              >
                <li>
                  <div className="flex flex-row items-center py-2 px-4 gap-4 hover:bg-emerald-200 transition-colors cursor-pointer">
                    <label className="swap swap-rotate">
                      <input
                        type="checkbox"
                        className="theme-controller"
                        value="dark"
                        id="theme-toggle"
                      />

                      <svg
                        className="swap-off h-7 w-7 fill-emerald-900"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                      </svg>

                      <svg
                        className="swap-on h-7 w-7 fill-emerald-900"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                      </svg>
                    </label>

                    <label
                      htmlFor="theme-toggle"
                      className="cursor-pointer text-emerald-900 font-medium flex-1"
                    >
                      Modo Escuro
                    </label>
                  </div>
                </li>
                <li>
                  <button
                    className="font-bold text-emerald-900"
                    onClick={handleLogout}
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;

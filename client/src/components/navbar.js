import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/");
  };
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/" className="link">
          Home
        </Link>
        {!cookies.access_token ? (
          <Link to="/auth" className="link">
            Login/Register
          </Link>
        ) : (
          <>
            <Link to="/create-recipe" className="link">
              CreateRecipe
            </Link>
            <Link to="/saved-recipes" className="link">
              SavedRecipes
            </Link>
            <button onClick={logout} className="link">
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

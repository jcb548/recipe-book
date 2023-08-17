import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useGetUsername } from "../hooks/useGetUsername";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const username = useGetUsername();
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    window.localStorage.removeItem("username");
    navigate("/");
  };
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/" className="link">
          Home
        </Link>
        {!cookies.access_token ? (
          <Link to="/login" className="link">
            Login
          </Link>
        ) : (
          <>
            <Link to="/create-recipe" className="link">
              Create Recipe
            </Link>
            <Link to="/saved-recipes" className="link">
              Saved Recipes
            </Link>
            <button onClick={logout} className="link">
              Logout
            </button>
            <div className="signedin">Signed in as: {username}</div>
          </>
        )}
      </div>
    </div>
  );
};

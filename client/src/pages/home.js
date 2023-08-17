import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cookies, _] = useCookies(["access_token"]);

  const userID = useGetUserID();
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get("http://localhost:3001/recipes/");
        setRecipes(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`,
          { headers: { authorization: cookies.access_token } }
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecipe();
    if (cookies.access_token) {
      fetchSavedRecipe();
    }
  }, []);
  useEffect(() => {});

  const saveRecipe = async (recipeID) => {
    try {
      const response = await axios.put(
        "http://localhost:3001/recipes",
        {
          recipeID,
          userID,
        },
        { headers: { authorization: cookies.access_token } }
      );
      setSavedRecipes(response.data.savedRecipes);
    } catch (err) {
      console.error(err);
    }
  };

  const isRecipeSaved = (id) => savedRecipes.includes(id);

  return (
    <div>
      <h2 className="recipesTitle">Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <div key={recipe._id} className="recipe">
            <div className="recipeTitle">{recipe.name}</div>
            <img src={recipe.image} alt={recipe.name} className="picture" />
            <div className="sectionTitle">Ingredients:</div>
            <div className="ingredients">
              {recipe.ingredients.map((ingredient) => (
                <li>{ingredient}</li>
              ))}
            </div>
            <div className="sectionTitle">Instructions:</div>
            <div className="instructions">{recipe.instructions}</div>
            <button
              onClick={() => saveRecipe(recipe._id)}
              disabled={isRecipeSaved(recipe._id)}
              className="savedButton"
            >
              {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

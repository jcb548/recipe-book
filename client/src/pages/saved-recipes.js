import { useEffect, useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useCookies } from "react-cookie";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  const [cookies, _] = useCookies(["access_token"]);
  useEffect(() => {
    const fetchSavedRecipe = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`,
          { headers: { authorization: cookies.access_token } }
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSavedRecipe();
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

  return (
    <div>
      <h2 className="recipesTitle">Recipes</h2>
      <ul>
        {savedRecipes.map((recipe) => (
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
          </div>
        ))}
      </ul>
    </div>
  );
};

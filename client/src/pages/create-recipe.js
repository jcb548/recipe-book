import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const CreateRecipe = () => {
  const userID = useGetUserID();

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: [],
    instructions: "",
    image: "",
    userOwner: userID,
  });
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, idx) => {
    const { value } = event.target;
    const ingredients = recipe.ingredients;
    ingredients[idx] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ""] });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertToBase64(file);
    setRecipe({ ...recipe, image: base64 });
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/recipes",
        recipe,
        {
          headers: { authorization: cookies.access_token },
        }
      );
      if (response.data._message) {
        alert(response.data._message);
      } else {
        alert("Recipe Created!");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="create-recipe">
      <h2>Create Recipe</h2>
      <form>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" id="name" onChange={handleChange} />
        <label htmlFor="ingredients">Ingredients</label>
        {recipe.ingredients.map((ingredient, idx) => (
          <input
            key={idx}
            type="text"
            name="ingredients"
            value={ingredient}
            onChange={(event) => handleIngredientChange(event, idx)}
          ></input>
        ))}
        <button onClick={addIngredient} type="button">
          Add ingredient
        </button>
        <label htmlFor="instructions">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          onChange={handleChange}
        />
        <label htmlFor="image">Image</label>
        <input
          type="file"
          accept=".jpeg, .png, .jpg"
          id="image"
          name="image"
          onChange={(event) => handleFileUpload(event)}
        />
        <button onClick={onSubmit} type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

function convertToBase64(file) {
  return new Promise((res, err) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      res(fileReader.result);
    };
    fileReader.onerror = (error) => {
      err(error);
    };
  });
}

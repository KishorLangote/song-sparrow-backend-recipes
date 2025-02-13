const express = require("express")

const app = express()
const { initializeDatabase } = require("./db/db.connect")
const Recipe = require("./models/recipe.models")

const cors = require("cors")
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions)); // middlerware

app.use(express.json()) // middleware..

initializeDatabase() // call the fun..

app.get("/", (req, res) => {
  res.send("Hello express server!!")
})

// 3. Create an API with route "/recipes" to create a new recipe in the recipes database. Make sure to handle errors properly. Test your API with Postman. Add the following recipe:

async function createNewRecipe(newRecipe){
  try{
    const recipe = new Recipe(newRecipe)
    const saveRecipe = await recipe.save()
    return saveRecipe;
} catch(error){
  throw error
 }
}

// api route "/recipes"

app.post("/recipes", async (req, res) =>{
    try{
      const savedRecipe = await createNewRecipe(req.body)
      res.status(200).json({ message: "Recipe added successfully.", recipe: savedRecipe })
    } catch(error){
      res.status(500).json({ error: "Failed to add recipe data in db."})
    }
})



// 6. Create an API to get all the recipes in the database as a response. Make sure to handle errors properly.

async function getAllRecipes(){
  try{
    const allRecipes = await Recipe.find()
    return allRecipes;
  }catch(error){
    throw error
  }
}

 // API to get all recipes:

 app.get("/recipes", async (req, res) => {
  try{
    const recipes = await getAllRecipes()
    if(recipes.length != 0){
      res.json(recipes)
    } else {
      res.status(404).json({ error: "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({ error: "Failed to fetch data."})
  }
 })

 // 7. Create an API to get a recipe's details by its title. Make sure to handle errors properly.

 async function getRecipeByTitle(recipeTitle){
  try{
    const recipeByTitle = await Recipe.findOne({ title: recipeTitle })
    return recipeByTitle;
  } catch(error){
    throw error;
  }
}

// api to get recipe by title:

app.get("/recipes/:recipeTitle", async (req, res) => {
  try{
    const recipes = await getRecipeByTitle(req.params.recipeTitle)
    if(recipes){
      res.json(recipes)
    } else {
      res.status(404).json({ error: "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({ error: "Failed to fetch database."})
  }
})


// 8. Create an API to get details of all the recipes by an author. Make sure to handle errors properly.

async function getAllRecipesByAuthor(recipeAuthor){
  try{
    const recipesByAuthor = await Recipe.find({ author: recipeAuthor })
    // console.log(recipesByAuthor)
    return recipesByAuthor;
  } catch(error){
    throw error;
  }
}

// api to get all recipes by author: 

app.get("/recipes/author/:recipeAuthor", async (req, res) => {
  try {
    const recipes = await getAllRecipesByAuthor(req.params.recipeAuthor)
    if(recipes){
      res.json(recipes)
    } else {
      res.status(404).json({ error: "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({ error: "Failed to fetch data."})
  }
})

// 9. Create an API to get all the recipes that are of "Easy" difficulty level.

async function getAllRecipesByDifficulty(RecipeDifficulty){
  try{
    const recipesByDifficulty = await Recipe.find({ difficulty: RecipeDifficulty })
    return recipesByDifficulty;
  } catch(error){
    throw error;
  }
}


// api to get all recipes by difficulty:

app.get("/recipes/difficulty/:recipeDifficulty", async (req, res) => {
    try {
      const recipes = await getAllRecipesByDifficulty(req.params.recipeDifficulty)
      if(recipes){
        res.json(recipes)
      } else {
        res.status(404).json({ error: "Recipe not found."})
      }
    } catch(error){
      res.status(500).json({ error: "Failed to fetch data."})
    }
})


// 10. Create an API to update a recipe's difficulty level with the help of its id. Update the difficulty of "Spaghetti Carbonara" from "Intermediate" to "Easy". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

async function updateRecipe(recipeId, dataToUpdate){
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, dataToUpdate, { new: true })
    return updatedRecipe;
  } catch(error){
    throw error;
  }
}


// api to update the recipe diffucilty level by using id:

app.post("/recipes/:recipeId", async (req, res) => {
  try{
    const updatedRecipe = await updateRecipe(req.params.recipeId, req.body)
    if(updatedRecipe){
      res.status(200).json({ message: "Recipe updated successfully.", recipe: updatedRecipe })
    } else {
      res.status(404).json({ error: "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({ error: "Failed to update data."})
  }
})


// 11. Create an API to update a recipe's prep time and cook time with the help of its title. Update the details of the recipe "Chicken Tikka Masala". Send an error message "Recipe not found" if the recipe is not found. Make sure to handle errors properly.

// Updated recipe data: { "prepTime": 40, "cookTime": 45 }

async function updateRecipes(recipeTitle, dataToUpdate){
  try{
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },   // Find the recipe by its title
        dataToUpdate,           // Data to update (e.g., prepTime and cookTime)
        { new: true })         // Return the updated recipe (not the old one)
    return updatedRecipe;
  } catch(error){
    throw error;
  }
}

 // api to update recipe data by using title:

 app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try{
    const updatedRecipe = await updateRecipes(req.params.recipeTitle, req.body)
    if(updatedRecipe){
      res.status(200).json({ message: "Recipe updated successfully.", recipe: updatedRecipe })
    } else {
      res.status(404).json({ error: "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({ error: "Failed to update data."})
  }
 })


 // 12. Create an API to delete a recipe with the help of a recipe id. Send an error message "Recipe not found" if the recipe does not exist. Make sure to handle errors properly.

 async function deleteRecipeById(recipeId){
  try{
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId)
    return deletedRecipe;
  } catch(error){
    throw error;
  }
 }


 //  api to delete recipe by id:

 app.delete("/recipes/:recipeId", async (req, res)=> {
  try{
    const deletedRecipe = await deleteRecipeById(req.params.recipeId)
    if(deletedRecipe){
      res.status(200).json({ message: 'Recipe deleted successfully.', recipe: deletedRecipe })
    } else {
      res.status(404).json({ error: "Recipe not found."})
    }
  } catch(error){
    res.status(500).json({ error: "Failed to delete reciep."})
  }
 })
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`)
})
const express = require('express');

const path = require('path')

const apiroutes = express.Router()

const auth = require('../middleware/auth')

apiroutes.use(express.urlencoded({extended: false}));

apiroutes.use(express.static(path.join(__dirname, '../../public')));

const API_KEY = '42da3c9d85354b22b5b3e82f3181630c'

apiroutes.post('/search/result', async (req, res) => {
    const query = req.body.query;
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${API_KEY}&query=${query}&number=6&addRecipeInformation=true`);
        const data = await response.json();
        const recipes = data.results;
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching recipes');
    }
});

apiroutes.get('/search', auth,  async (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/static', 'results.html'))
});

apiroutes.get('/search/recipe/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/static', 'showrecipe.html'))
}); 

apiroutes.get('/search/recipe/dish/:id', async (req, res) => {
    const recipeId = req.params.id;
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`);
        const recipe = await response.json();
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching recipe details');
    }
});


module.exports = apiroutes;
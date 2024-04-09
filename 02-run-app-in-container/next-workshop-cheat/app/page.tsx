'use client';

import Title from './components/Title';
import Ingredients from './components/Ingredients';
import { FormEvent, useEffect, useState } from 'react';
import RecipeGPT from './components/RecipeGPT';

type IngredientForm = {
  target: {
    ingredient: {
      value: string;
    };
  };
} & FormEvent;

export default function Home() {
  const text = 'TechCollEDGE cookbook';

  const [recipeString, setRecipeString] = useState('');
  const [ingredients, setIngredients] = useState<Array<string>>([]);

  const addIngredient = (event: IngredientForm) => {
    event.preventDefault();
    if (!event.target.ingredient) return;
    const val = event.target.ingredient.value.trim();
    if (ingredients.includes(val) || val === '') return;
    setIngredients((ingredients) => [...ingredients, val]);
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(() => ingredients.filter((ing) => ing !== ingredient));
  };

  useEffect(() => {
    setRecipeString(() => ingredients.join(', '));
  }, [ingredients]);
  return (
    <main>
      <Title text={text}></Title>
      <p>
        <small>Add ingredients, then click for a recipe.</small>
      </p>
      <Ingredients
        ingredients={ingredients}
        addIngredient={addIngredient}
        removeIngredient={removeIngredient}
      ></Ingredients>
      <RecipeGPT recipe={recipeString}></RecipeGPT>
    </main>
  );
}

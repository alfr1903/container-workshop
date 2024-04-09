'use client';

import { FormEventHandler, useState } from 'react';

interface IngredientsProps {
  ingredients: Array<string>;
  addIngredient: FormEventHandler;
  removeIngredient: Function;
}

export default function Ingredients({
  ingredients,
  addIngredient,
  removeIngredient,
}: IngredientsProps) {
  const [userInput, setUserInput] = useState('');

  return (
    <div>
      {ingredients.map((ingredient) => {
        return (
          <div key={ingredient}>
            <span>{ingredient}</span>
            <button onClick={() => removeIngredient(ingredient)}>Remove</button>
          </div>
        );
      })}
      <form
        onSubmit={(e) => {
          addIngredient(e);
          setUserInput(() => '');
        }}
      >
        <input
          name='ingredient'
          type='text'
          placeholder='Enter ingredient'
          autoComplete='off'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button type='submit'>Add</button>
      </form>
    </div>
  );
}

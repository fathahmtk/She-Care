import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types';

// Define the expected JSON schema for the recipe response from the Gemini API.
const schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The creative and appealing title of the recipe." },
    description: { type: Type.STRING, description: "A brief, engaging description of the dish." },
    prepTime: { type: Type.STRING, description: "Estimated preparation time (e.g., '15 minutes')." },
    cookTime: { type: Type.STRING, description: "Estimated cooking time (e.g., '25 minutes')." },
    servings: { type: Type.STRING, description: "Number of servings the recipe makes (e.g., '4 servings')." },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "A list of all ingredients required for the recipe.",
    },
    instructions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Step-by-step instructions to prepare the dish.",
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Optional creative tips, variations, or serving suggestions."
    },
  },
  required: ["title", "description", "prepTime", "cookTime", "servings", "ingredients", "instructions"],
};

const RecipeGenerator: React.FC = () => {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateRecipe = async () => {
    if (!ingredients.trim()) {
      setError('Please enter at least one ingredient.');
      return;
    }
    setError('');
    setIsLoading(true);
    setRecipe(null);

    try {
      // FIX: Removed `as string` type assertion to strictly follow API key handling guidelines.
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a creative chef. Based on the following ingredients, create a delicious and easy-to-follow recipe. If the ingredients seem nonsensical, create a fun, imaginative recipe anyway. Ingredients: ${ingredients}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      });

      const recipeData = JSON.parse(response.text) as Recipe;
      setRecipe(recipeData);

    } catch (err) {
      console.error('Error generating recipe:', err);
      setError('An error occurred while generating the recipe. It could be a temporary issue with the AI service or your network. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="recipe-ai" className="py-24">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-heading text-accent mb-4">AI Recipe Generator</h2>
        <p className="text-text-secondary mb-8 max-w-2xl mx-auto">
          Got random ingredients? Let our AI chef whip up a creative recipe for you!
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
                if(error) setError('');
              }}
              placeholder="e.g., chicken, rice, broccoli, soy sauce"
              className="w-full flex-grow px-4 py-3 bg-surface border border-border-color text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all disabled:opacity-50"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerateRecipe}
              disabled={isLoading}
              className="bg-accent text-background-start font-body font-semibold py-3 px-8 border-2 border-accent hover:bg-transparent hover:text-accent transition-all duration-300 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : 'Generate Recipe'}
            </button>
          </div>
          {error && (
            <div className="mt-4 text-left bg-red-500/10 border border-red-500/20 text-red-600 p-4 rounded-lg flex items-start gap-3" role="alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold">Generation Failed</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
        </div>

        {recipe && !isLoading && (
          <div className="mt-12 text-left bg-surface/80 p-8 rounded-lg border border-border-color animate-fade-in">
            <h3 className="text-3xl font-heading text-accent mb-4">{recipe.title}</h3>
            <p className="text-text-secondary mb-6 italic">{recipe.description}</p>
            
            <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 border-y border-border-color py-4">
              <div className="text-center">
                <p className="font-bold text-text-primary">Prep Time</p>
                <p className="text-text-secondary">{recipe.prepTime}</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-text-primary">Cook Time</p>
                <p className="text-text-secondary">{recipe.cookTime}</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-text-primary">Servings</p>
                <p className="text-text-secondary">{recipe.servings}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <h4 className="text-xl font-heading text-text-primary mb-3">Ingredients</h4>
                <ul className="list-disc list-inside space-y-2 text-text-secondary">
                  {recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-xl font-heading text-text-primary mb-3">Instructions</h4>
                <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                  {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                </ol>
              </div>
            </div>
            
            {recipe.tips && recipe.tips.length > 0 && (
                <div className="mt-8 pt-6 border-t border-border-color">
                    <h4 className="text-xl font-heading text-text-primary mb-3">Chef's Tips</h4>
                     <ul className="list-disc list-inside space-y-2 text-text-secondary">
                        {recipe.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                    </ul>
                </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecipeGenerator;
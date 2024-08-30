'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
const { saveMeal } = require("./meals");



export async function shareMeal(prevState, formData) {
    const meal = {
        title: formData.get('title'),
        summary: formData.get('summary'),
        instructions: formData.get('instructions'),
        image: formData.get('image'),
        creator: formData.get('name'),
        creator_email: formData.get('email'),
    };

    function isInvalidText(text){
      return !text || text.trim() === '';
    }

    if(
      isInvalidText(meal.title) || 
      isInvalidText(meal.summary) || 
      isInvalidText(meal.instructions) ||
      isInvalidText(meal.creator) ||
      isInvalidText(meal.creator_email) ||
      !meal.creator_email.includes('@') ||
      !meal.image || meal.image.size === 0
    ){
      return {
        message: "Invalid input!"
      }
    }

    await saveMeal(meal);

    revalidatePath('/meals');
    // Redirect to the /meals page
    redirect('/meals');
}

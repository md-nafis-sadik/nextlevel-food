import sql from 'better-sqlite3';

const db = sql('meals.db');

export async function getMeals() {
    // Simulate a delay for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // throw new Error('Loading meals failed')

    // Fetch and return all meals from the database
    const meals = db.prepare('SELECT * FROM meals').all();
    return meals;
}

export async function getMeal(slug){
    
    return db.prepare('SELECT * FROM meals WHERE slug = ?').get(slug);
}

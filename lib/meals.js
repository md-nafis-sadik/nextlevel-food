import sql from 'better-sqlite3';
import slugify from 'slugify';
import xss from 'xss';
import fs, { write } from 'node:fs';

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

export async function saveMeal(meal) {
    meal.slug = slugify(meal.title, { lower: true });
    meal.instructions = xss(meal.instructions);

    // Ensure slug is unique by appending a number if a conflict exists
    let existingMeal = db.prepare('SELECT * FROM meals WHERE slug = ?').get(meal.slug);
    let slugCounter = 1;

    while (existingMeal) {
        meal.slug = `${slugify(meal.title, { lower: true })}-${slugCounter}`;
        existingMeal = db.prepare('SELECT * FROM meals WHERE slug = ?').get(meal.slug);
        slugCounter++;
    }

    // Handle image saving
    const extension = meal.image.name.split('.').pop();
    const fileName = `${meal.slug}.${extension}`;

    const stream = fs.createWriteStream(`public/images/${fileName}`);
    const bufferedImage = await meal.image.arrayBuffer();

    stream.write(Buffer.from(bufferedImage), (error) => {
        if (error) {
            throw new Error('Saving image failed!');
        }
    });

    meal.image = `/images/${fileName}`;

    // Insert the meal into the database
    db.prepare(`
        INSERT INTO meals 
            (title, summary, instructions, creator, creator_email, image, slug)
        VALUES (   
            @title,
            @summary,
            @instructions,
            @creator,
            @creator_email,
            @image,
            @slug
        )
    `).run(meal);
}

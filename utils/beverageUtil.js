const { beverage } = require("../models/beverage");
const fs = require("fs").promises;
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);
        await fs.writeFile(filename, JSON.stringify(allObjects), "utf8");
        return allObjects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function addbeverage(req, res) {
    try {
        const { name, image, price, category, description, rating, quantity } = req.body;

        // Check for missing required fields
        if (!name || !image || !price || !category || !description || !rating || !quantity) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Check for price, rating, and quantity to be numbers
        if (isNaN(price)) {
            return res.status(400).json({ message: "Price must be a number." });
        } else if (isNaN(rating)) {
            return res.status(400).json({ message: "Rating must be a number." });
        } else if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5." });
        } else if (isNaN(quantity)) {
            return res.status(400).json({ message: "Quantity must be a number." });
        } else {
            const newbeverage = new beverage(name, image, price, category, description, rating, quantity);
            const updatedbeverages = await writeJSON(newbeverage, "utils/beverages.json");
            return res.status(201).json(newbeverage); // Return the newly added beverage object
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

async function viewBeverage(req, res) {
    try {
        const allResources = await readJSON('utils/beverages.json');
        return res.status(201).json(allResources);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


module.exports = {
    readJSON,
    writeJSON,
    addbeverage,
    viewBeverage
};

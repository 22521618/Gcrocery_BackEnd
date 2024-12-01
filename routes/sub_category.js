const express = require('express');
const SubCategory = require('../models/sub_category');
const subcategoryRouter = express.Router();

subcategoryRouter.post('/api/subcategories', async (req, res) => {
    try {
        const { categoryId, categoryName, image, subCategoryName } = req.body;
        const subcategory = new SubCategory({ categoryId, categoryName, image, subCategoryName });
        await subcategory.save();
        res.status(201).send(subcategory);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

subcategoryRouter.get('/api/subcategories', async (req, res) => {
    try {
      const subcategories = await SubCategory.find();
      return res.status(200).json(subcategories);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });

subcategoryRouter.get('/api/category/:categoryName/subcategories', async (req, res) => {
    try {
        // Extract the categoryName from the request URL using Destructuring
        const { categoryName } = req.params;

        const subcategories = await SubCategory.find({ categoryName: categoryName });

        // Check if any subcategories were found
        if (!subcategories || subcategories.length == 0) {
            // If no subcategories are found, response with a status code 404 error
            return res.status(404).json({ msg: "subcategories not found" });
        } else {
            return res.status(200).json(subcategories);
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = subcategoryRouter;
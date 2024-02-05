//users routes server side
import express from "express";
 import { getFoodCategories, getSUBFoodCategories } from "./categoriesCtrl";    


const router = express.Router()

router
    .get('/food-categories', getFoodCategories)
    .get('/sub-food-categories', getSUBFoodCategories)



export default router
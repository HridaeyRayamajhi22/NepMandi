import { Router } from 'express'
import auth from '../middleware/auth.js'
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controllers.js'

const categoryRouter = Router()

categoryRouter.post("/add-category",AddCategoryController)
categoryRouter.get('/get',getCategoryController)
categoryRouter.put('/update',updateCategoryController)
categoryRouter.delete("/delete",deleteCategoryController)

export default categoryRouter
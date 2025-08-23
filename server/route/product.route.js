import { Router } from 'express'
import auth from '../middleware/auth.js'
import { createProductController, deleteProductDetails, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, searchProduct, updateProductDetails, getProductsByCategories  } from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'

const productRouter = Router()

productRouter.post("/create",createProductController)
productRouter.post('/get',getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryAndSubCategory)

//get product details
productRouter.post('/get-product-details',getProductDetails)

//update product
productRouter.put('/update-product-details',updateProductDetails)

//delete product
productRouter.delete('/delete-product',deleteProductDetails)

//search product 
productRouter.post('/search-product',searchProduct)

// Fetch details for all the categories at once
productRouter.post("/get-products-by-categories", getProductsByCategories);


export default productRouter
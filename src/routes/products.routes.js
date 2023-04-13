import { Router } from "express";
import { registerProduct, listProducts, getProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js"

const router = Router()

router.post('/api/products', registerProduct)
router.get('/api/products', listProducts)
router.get('/api/products/:id',getProduct)
router.put('/api/products',updateProduct)
router.delete('/api/products/:id',deleteProduct)

export default router
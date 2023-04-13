import { ProductsModel } from "../../models/products.model.js";
import { ObjectId } from "mongodb";


export async function registerProduct(name, description, price, image)  {
    try {
            const NewProduct = new ProductsModel({name, description, price, image});
            await NewProduct.save()
            return NewProduct  
    } catch (error) {
        console.log(error) 
        return json({ error: 'Error al insertar producto' })          
     }
}

export async function listProducts() {
    try {
            const listado = await ProductsModel.find()
            return listado
    } catch (error) {
        console.log(error) 
        return console.log('Error al listar productos')          
     }
}

export async function getProduct(id) {
    try {
            const product = await ProductsModel.findById(id)
            return product
    } catch (error) {
        console.log( 'Error al buscar producto' + error) 
     }
}

export async function updateProduct (id, name, description, price, image) {
    try {
            const product = await ProductsModel.updateOne({_id: id},{ $set: {name: name, description: description, price: price, image: image} })
            if(!product) console.log(json({ error: 'No existe el producto registrado en la DB' }))     
            return product
    } catch (error) {
        console.log(error +  ' - Error al buscar producto') 
     }
}

export async function deleteProduct(id) {
    try {
            await ProductsModel.deleteOne({_id: id})
    } catch (error) {
        console.log(error + ' - Error al borrar el producto') 
     }
}
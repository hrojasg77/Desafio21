import { Schema, model } from "mongoose";

const productsSchema = new Schema({
    id: { type: String, trim: true },
    name : { type: String},
    description: { type:  String },
    price : { type:  Number },
    image: { type:  String }
})

export const ProductsModel = model('productsSchema',productsSchema)
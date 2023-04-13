import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'
import { Router } from "express";
import { 
     registerProduct, 
     listProducts, 
     getProduct, 
     updateProduct, 
     deleteProduct 
    } from "../controllers/products.controller.graphql.js"

const schema = buildSchema(`

   type Products {
   name : String,
   description: String ,
   price : Int ,
   image:  String 
   }

  input ProductsInput {
    name : String,
    description: String ,
    price : Int ,
    image:  String 
  }

  type Query {
    getProduct(id: ID!): Products
    listProducts(campo: String, valor: String): [Products]
  }
  
  type Mutation {
    registerProduct(datos : ProductsInput) : Products 
    updateProduct(id: ID!, datos: ProductsInput!) : Products
    deleteProduct(id: ID!): Products
  }
`)

export const graphqlMiddleware = graphqlHTTP({
    schema,
    rootValue: {
        registerProduct, 
        listProducts, 
        getProduct, 
        updateProduct, 
        deleteProduct 
    },
    graphiql: true,
  })
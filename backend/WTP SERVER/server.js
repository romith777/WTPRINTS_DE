require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

let dbMain=null;
let dbProducts=null;

const options={
  serverSelectionTimeoutMS:5000,
  socketTimeoutMS:45000,
  maxPoolSize:10,
  minPoolSize:1,
  maxIdleTimeMS:10000,
  retryWrites:true,
  w:"majority"
};

async function connectMainDB(){
  if(dbMain && dbMain.readyState===1) return dbMain;

  const uri=process.env.MONGODB_URI;
  if(!uri){
    console.warn("MONGODB_URI missing");
    return null;
  }

  dbMain=await mongoose.createConnection(uri,options).asPromise();
  console.log("Main DB connected");
  return dbMain;
}

async function connectProductDB(){
  if(dbProducts && dbProducts.readyState===1) return dbProducts;

  const uri=process.env.MONGODB_URI_PRODUCTS;
  if(!uri){
    console.warn("MONGODB_URI_PRODUCTS missing");
    return null;
  }

  dbProducts=await mongoose.createConnection(uri,options).asPromise();
  console.log("Products DB connected");
  return dbProducts;
}

const productMain = require('./productMainSchema.js');
const productDB = require('./productDBSchema.js');

app.get("/sync",async(req,res)=>{
  try{
    const db1=await connectMainDB();
    const db2=await connectProductDB();
    console.log("sync");

    if(!productMain){
      return res.status(500).json({ error: 'Product model not available' });
    }
    if(!productDB){
      return res.status(500).json({ error: 'Product model not available' });
    }

    const sch = new mongoose.Schema({},{strict:false});
    const productsMain = await db1.model('mainProducts',sch,'products');
    const MainData = await productsMain.findOne({});

    const productsDB = await db2.model('userProducts',sch,'products');
    const DBData = await productsDB.find({});
    
    let tees = [];
    let products = {
      tees: [],
      hoodies: [],
      cargos: [],
      shirts: [],
      jeans: [],
      joggers: []
    };
    let productNames = ["tees","hoodies","cargos","shirts","jeans","joggers"];

    for(let details in DBData){
      for(let type in productNames){
        for(let product in DBData[details][productNames[type]])
        products[productNames[type]].push({...DBData[details][productNames[type]][product],selectedSize : "M"});
      }     
    }

    console.log(products);

    for(let type in productNames){
      await productsMain.findOneAndUpdate(
        {},
        {[productNames[type]]: products[productNames[type]]},
        {selectedSize: "M"}
      )
    }
    console.log('update success');
    res.json({status: true,message:"connected both dbs"});
  }
  catch (err){
    console.error(err);
    res.json(500).json({status:false,message:"failed syncing"});
  }
});

app.listen(5510, ()=>{
  console.log("Server running on port 5510");
});

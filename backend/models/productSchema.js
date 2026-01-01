const mongoose = require('mongoose');

const subProduct = new mongoose.Schema({
  productType : String,
  name : String,
  brandName : String,
  about : String,
  image : [String],
  priceCents : Number,
  keyword : {
    type: [String],
    default : []
  }
})

const productSchema = new mongoose.Schema({
  username: { type:String, required: true},
  cargos: {type:[subProduct],default: []},
  hoodies: {type:[subProduct],default: []},
  tees: {type:[subProduct],default: []},
  shirts: {type:[subProduct],default: []},
  jeans: {type:[subProduct],default: []},
  joggers: {type:[subProduct],default: []}
});

module.exports = mongoose.model('Product',productSchema);
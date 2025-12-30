const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  username: { type:String, required: true},
  cargos: [
      {
      productType: String,
      productKey: String,
      about: String,
      brandName: String,
      id: String,
      image: String,
      keyword: [String],
      name: String,
      priceCents: Number
    }
  ],
  hoodies: [
      {
      productType: String,
      productKey: String,
      about: String,
      brandName: String,
      id: String,
      image: String,
      keyword: [String],
      name: String,
      priceCents: Number
    }
  ],
  tees: [
      {
      productType: String,
      productKey: String,
      about: String,
      brandName: String,
      id: String,
      image: String,
      keyword: [String],
      name: String,
      priceCents: Number
    }
  ],
  shirts: [
      {
      productType: String,
      productKey: String,
      about: String,
      brandName: String,
      id: String,
      image: String,
      keyword: [String],
      name: String,
      priceCents: Number
    }
  ],
  jeans: [
      {
      productType: String,
      productKey: String,
      about: String,
      brandName: String,
      id: String,
      image: String,
      keyword: [String],
      name: String,
      priceCents: Number
    }
  ],
  joggers: [
      {
      productType: String,
      productKey: String,
      about: String,
      brandName: String,
      id: String,
      image: String,
      keyword: [String],
      name: String,
      priceCents: Number
    }
  ]
});

module.exports = mongoose.model('Product',productSchema);
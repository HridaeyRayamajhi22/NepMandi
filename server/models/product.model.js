import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: Array,
    default: [],
  },
  category: [
  {
    type: mongoose.Schema.ObjectId,
    ref: "Category",
  },
],
subCategory: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "SubCategory",
    },
  ],
  unit: {
    type: String,
    default: "",
  },
  stock: {
    type: Number,
    default: null,
  },
  price: {
    type: Number,
    default: null,
  }, 
  discount: {
    type: Number,
    default: null,
  },
  description: {
    type: String,
    default: "",
  },
  moreInfo: {
    type: Object,
    default: {},
  },
  published: {
    type: Boolean,
    default: true,
  },
}, { 
    timestamps: true
})

//create a text index
productSchema.index({
  name  : "text",
  description : 'text'
},
{ weights:{
  name : 10,
  description : 5
}})

const ProductModel= mongoose.model("Product", productSchema);
export default ProductModel
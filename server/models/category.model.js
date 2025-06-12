import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  isLocal: {
    type: Boolean,
    default: false, // false = Imported/Common, true = Local
  },
}, { 
  timestamps: true
}); 

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;

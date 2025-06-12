import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({ 
    address_line: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    pincode: {
        type: String,
        default: ""
    },
    mobile: {
        type: String,
        default: ""
    },
    status: {
        type: Boolean,
        default: "true"
    },
}, { 
    timestamps: true

})

const AddressModel= mongoose.model("Address", addressSchema);
export default AddressModel
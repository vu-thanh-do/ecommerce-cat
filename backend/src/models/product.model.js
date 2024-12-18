import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: [{ url: String, publicId: String, filename: String }],
    description: {
      type: String,
      require: true,
    },
    sale: {
      // value: Number,
      // isPercent: {
      //   type: Boolean,
      //   default: false,
      // },
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    sizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Size',
        // name: {
        //   type: String,
        //   required: true,
        // },
        // price: {
        //   type: Number,
        //   required: true,
        // },
      },
    ],
    toppings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Topping',
      },
    ],
    timBooking: String,
    kindOfRoom: [],
    comments: [],
    sex : String,
    price: Number,
    origin : String,
    weight: String,
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true, versionKey: false }
);

productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;

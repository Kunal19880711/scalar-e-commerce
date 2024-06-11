const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: [4, "product name must be at least 4 characters"],
    },

    price: {
      type: Number,
      required: true,
      min: [0, "price cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "discount cannot be negative"],
      validate: [
        function () {
          return this.discount <= this.price;
        },
        "discount cannot be greater than price",
      ],
    },
    description: {
      type: String,
      required: true,
      minLength: [10, "product description must be at least 10 characters"],
    },
    brand: String,
    category: {
      type: String,
      required: true,
      default: "Miscellaneous",
    },
  },
  {
    timestamps: true,
  }
);

exports.ProductModel = model("productModel", productSchema);

const sampleProducts = [
    {
        "name": "Smart TV",
        "price": 1000,
        "description": "A Smart TV with many features. It has internet connectivity, can play various video formats, and comes with a remote control.",
        "brand": "Samsung",
        "category": "Electronics"
    },
    {
        "name": "Laptop",
        "price": 1500,
        "description": "A high-quality laptop with a powerful processor. It comes with a touchpad, a webcam, and a built-in DVD drive.",
        "brand": "Apple",
        "category": "Electronics"
    },
    {
        "name": "Gaming Console",
        "price": 2000,
        "description": "A state-of-the-art gaming console with a powerful processor and a high-quality graphics card. It comes with a controller, a HDMI cable, and a headset.",
        "brand": "Sony",
        "category": "Electronics"
    },
    {
        "name": "Smartphone",
        "price": 800,
        "description": "A high-quality smartphone with a powerful processor and a high-resolution display. It comes with a touchscreen, a front and rear camera, and a fingerprint scanner.",
        "brand": "Samsung",
        "category": "Electronics"
    },
    {
        "name": "High-Quality Headphones",
        "price": 1200,
        "description": "A pair of high-quality headphones with a powerful amplifier. They are designed for listening to music and come with a carrying case.",
        "brand": "Bose",
        "category": "Audio"
    },
    {
        "name": "Portable Speaker",
        "price": 500,
        "description": "A portable speaker with excellent sound quality. It has a long battery life and is easy to carry around.",
        "brand": "JBL",
        "category": "Audio"
    },
    {
        "name": "Tablet",
        "price": 1000,
        "description": "A tablet with a touchscreen display. It comes with a built-in camera, Wi-Fi connectivity, and a touch keyboard.",
        "brand": "Apple",
        "category": "Electronics"
    },
    {
        "name": "Digital Camera",
        "price": 2000,
        "description": "A digital camera with high-quality sensors and a large image sensor. It supports various modes and has a long battery life.",
        "brand": "Canon",
        "category": "Electronics"
    },
    
]










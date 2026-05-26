import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: [true, 'El ID del restaurante es requerido'],
    },
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    category: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: ['appetizer', 'main_course', 'dessert', 'beverage', 'side'],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    ingredients: [{
      type: String,
      trim: true,
    }],
    allergens: [{
      type: String,
      trim: true,
    }],
    preparationTime: {
      type: Number,
      min: [0, 'El tiempo de preparación no puede ser negativo'],
    },
    nutritionalInfo: {
      calories: Number,
      protein: Number,
      carbs: Number,
      fat: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ name: 1 });
menuItemSchema.index({ isAvailable: 1 });

export default mongoose.model('MenuItem', menuItemSchema);
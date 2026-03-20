import mongoose, { Schema, Document, Model } from "mongoose";

export interface INavDropdownItem {
  id: string;
  label: string;
  description: string;
  image: string;
  buttonText: string;
  link?: string;
  order: number;
}

export interface INavDropdown extends Document {
  menuKey: "marques" | "maison";
  menuLabel: string;
  items: INavDropdownItem[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NavDropdownItemSchema = new Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  buttonText: { type: String, required: true },
  link: { type: String },
  order: { type: Number, default: 0 },
});

const NavDropdownSchema = new Schema<INavDropdown>(
  {
    menuKey: {
      type: String,
      required: true,
      enum: ["marques", "maison"],
      unique: true,
    },
    menuLabel: {
      type: String,
      required: true,
    },
    items: [NavDropdownItemSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const NavDropdown: Model<INavDropdown> =
  mongoose.models.NavDropdown ||
  mongoose.model<INavDropdown>("NavDropdown", NavDropdownSchema);

export default NavDropdown;

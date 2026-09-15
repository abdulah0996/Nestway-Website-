import mongoose from 'mongoose';

export const emailValidator = {
  type: String,
  required: true,
  lowercase: true,
  trim: true,
  match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
};

export const optionalEmailValidator = {
  type: String,
  lowercase: true,
  trim: true,
  match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address'],
};

export const slugValidator = {
  type: String,
  required: true,
  unique: true,
  lowercase: true,
  trim: true,
  match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain lowercase letters, numbers, and hyphens'],
};

export const objectId = (ref, options = {}) => ({
  type: mongoose.Schema.Types.ObjectId,
  ref,
  ...options,
});

export const seoSchema = new mongoose.Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 60 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    keywords: [{ type: String, trim: true, lowercase: true }],
  },
  { _id: false },
);

export const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const timestamps = { timestamps: true };

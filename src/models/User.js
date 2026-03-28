const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" }, // initials e.g. "SS"
    bio: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    rating: { type: Number, default: 0 },
    completedDeals: { type: Number, default: 0 },
    booksListed: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    badge: { type: String, enum: ["Top Seller", "Verified", null], default: null },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Auto-generate avatar initials
userSchema.pre("save", function () {
  if (this.isModified("name") || !this.avatar) {
    const parts = this.name.trim().split(/\s+/);
    this.avatar = parts.filter(p => p).map((p) => p[0].toUpperCase()).join("").slice(0, 2);
  }
});

module.exports = mongoose.model("User", userSchema);

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
    // unique: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a vaild email'],
  },
  photo: {
    type: String,
    // required: [true, 'A user must have a photo'],
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'A user must have a password'],
    minlength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE/SAVE!!
      // callback function called when new document created
      // if the current elem === to this password

      validator: function (el) {
        return el === this.password; // abc === abc
      },
      message: 'Passwrods do not match!',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre('save', async function (next) {
  // Only run this method if password was modified

  if (!this.isModified('password')) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);

  // Delete password cofirm field

  this.confirmPassword = undefined;

  next();
});

// Availble on all documents of certain collection

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

// Reset password in case user forgot it

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  console.log(
    { resetToken },
    this.passwordResetToken,
    this.passwordResetExpires
  );
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

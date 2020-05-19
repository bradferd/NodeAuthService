const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt-nodejs");

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: String,
});

// On save hook, encrypt password
// before saving a model, run this function
userSchema.pre("save", function (next) {
  // get access to the user model
  const user = this;
  // generate a salt
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    // hash our password using this salt
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) {
        return next(err);
      }

      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) { return callback(err); }

        callback(null, isMatch);
    })
}

// create the model class
const UserCollection = mongoose.model("user", userSchema);

// Export the model
module.exports = UserCollection;

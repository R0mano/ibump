const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_ROUND = 6;

const userSchema = new mongoose.Schema({
  email: {type: String, required: true, lowercase: true, unique: true},
  password: String
}, {
  timestamps: true
});

userSchema.pre('save', function(next) {
// Mongoose binds 'this' to be the 'Document'
const user = this;
if (!user.isModified('password')) return next();
bcrypt.hash(
  user.password,
  SALT_ROUND,
  function(err, hash) {
    if (err) return next(err);
    user.password = hash;
     return next();
  }
);
});

userSchema.methods.comparePassword = function(tryPassword, cb) {
  // 'this' is the Document
  bcrypt.compare(tryPassword, this.password, cb)
}

userSchema.set('toJSON', {
  transform: function(doc, ret) {
    // remove the password property when serializing doc to JSON
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
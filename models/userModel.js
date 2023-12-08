const mongoose = require('mongoose');
// const slugify = require('slugify');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { default: isEmail } = require('validator/lib/isEmail');
// Schema
//NAME EMAIL PHOTO(STRING) PASSWORD PASSWORDCONFIRM
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A User must have a name'],
      // validate: [validator.isAlpha, 'user name must only contain characters']
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Please enter your email"],
        validate: [validator.isEmail, "A User must have a valid email"],
        unique: true,
      },
    photo: [String],
    password: {
      type: String,
      required: [true, 'A User must have a Password'],
      minlength: [8, 'A user password must be greater or equal then 8'],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'A user must hae a rating'],
      validate: {
        validator: function(el) {
            return (el) === this.password;
        },
        message: 'Passwords are not the same'
      },
    },
  },
//   {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   },
);
//DOCUMENT MIDDLEWARE: runs before .save() and .create()
userSchema.pre('save', async function (next) {
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined;
  next();
});



// //QUERY MIDDLEWARE
// userSchema.pre(/^find/, function (next) {
//   this.find({ secretUser: { $ne: true } });
//   this.start = Date.now();
//   next();
// });
// userSchema.post(/^find/, function (docs, next) {
//   console.log(`Query tok ${Date.now() - this.start}milliseconds`);
//   next();
// });

// //AGGREGATION MIDDLEWARE
// userSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretUser: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

userSchema.methods.correctPassword = async function(
    candidatePassword, 
    userPassword
)
{
    return bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

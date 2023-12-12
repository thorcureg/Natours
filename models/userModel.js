const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// Schema
//NAME EMAIL PHOTO(STRING) PASSWORD PASSWORDCONFIRM
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A User must have a name'],
        validate: [validator.isAlpha, 'user name must only contain characters'],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, 'Please enter your email'],
        validate: [validator.isEmail, 'A User must have a valid email'],
        unique: true,
    },
    photo: [String],
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
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
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same',
        },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
});
//DOCUMENT MIDDLEWARE: runs before .save() and .create()
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );
        console.log(changedTimestamp, JWTTimestamp);
        return changedTimestamp > JWTTimestamp;
    }

    // If the password has never been changed, return false
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetExpires = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

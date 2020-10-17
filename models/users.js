const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        max: 100
    },
    last_name: {
        type: String,
        required: true,
        max: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        max: 100
    },
    pwsalt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    addresses: [{
        addr_line_1: {
            type: String,
            required: true
        },
        addr_line_2: String,
        unit: String,
        postal: {
            type: String,
            required: true
        },
        city: String,
        state: String,
        country: {
            type: String,
            required: true
        }
    }],
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    },
    updated_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel

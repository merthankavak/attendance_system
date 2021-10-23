const mongoose = require('mongoose');

const studentTokenSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('StudentTokens', studentTokenSchema);
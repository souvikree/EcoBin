const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    bin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bin',
        required: true
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

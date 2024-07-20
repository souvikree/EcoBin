const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
    location: {
        type: {
            type: String,
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    },
    status: {
        type: String,
        default: "normal"
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    acceptedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
        default: null
    },
    notified: {
        type: Boolean,
        default: false
    }
});

const Bin = mongoose.model('Bin', binSchema);

module.exports = Bin;

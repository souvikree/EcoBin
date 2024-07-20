const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Driver', 
        required: true 
    },
  route: [{
        type: {
        type: String,
        enum: ['Point'],  // GeoJSON type
        required: true
        },
        coordinates: {
        type: [Number],  // [longitude, latitude]
        required: true
        }
  }],
  status: { 
        type: String, 
        enum: ['pending', 'completed'], 
        default: 'pending' 
    },
  assignedAt: { 
        type: Date, 
        default: Date.now 
    },
  completedAt: { 
        type: Date 
    }
});

// Create a geospatial index for the route points
RouteSchema.index({ route: '2dsphere' });

module.exports = mongoose.model('Route', RouteSchema);

const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  driverId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Driver', 
        required: true 
    },
  issue: { 
        type: String, 
        required: true 
    },  // Description of the issue
  location: {
    type: {
      type: String,
      enum: ['Point'],  // GeoJSON type
      required: true
    },
    coordinates: {
      type: [Number],  // [longitude, latitude]
      required: true
    }
  },
  timestamp: { 
        type: Date, 
        default: Date.now 
    },  // When the issue was reported
  status: { 
        type: String, 
        enum: ['open', 'resolved'], 
        default: 'open' 
    }  // Report status
});

// Create a geospatial index for the report location
ReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Report', ReportSchema);

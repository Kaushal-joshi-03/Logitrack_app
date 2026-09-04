const mongoose = require('mongoose');

const PackageHistorySchema = new mongoose.Schema({
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
    index: true
  },
  packageId: {
    type: String,
    required: true,
    index: true
  },
  status: {
    type: String,
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'System'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PackageHistory', PackageHistorySchema);

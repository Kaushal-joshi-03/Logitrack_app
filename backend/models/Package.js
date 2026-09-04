const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
  packageId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please associate a client']
  },
  senderName: {
    type: String,
    required: [true, 'Please add sender name']
  },
  senderPhone: {
    type: String,
    required: [true, 'Please add sender phone']
  },
  pickupAddress: {
    type: String,
    required: [true, 'Please add pickup address']
  },
  receiverName: {
    type: String,
    required: [true, 'Please add receiver name']
  },
  receiverPhone: {
    type: String,
    required: [true, 'Please add receiver phone']
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Please add delivery address']
  },
  originCity: {
    type: String,
    required: [true, 'Please specify origin city']
  },
  destinationCity: {
    type: String,
    required: [true, 'Please specify destination city']
  },
  description: {
    type: String,
    default: 'Standard Package'
  },
  weight: {
    type: Number,
    required: [true, 'Please add weight in kg']
  },
  dimensions: {
    length: { type: Number, default: 10 },
    width: { type: Number, default: 10 },
    height: { type: Number, default: 10 }
  },
  priority: {
    type: String,
    enum: ['Standard', 'Express', 'Urgent'],
    default: 'Standard'
  },
  status: {
    type: String,
    enum: [
      'REQUEST_CREATED',
      'WAREHOUSE_RECEIVED',
      'PACKAGE_PROCESSED',
      'DISTRIBUTOR_RECEIVED',
      'ASSIGNED_FOR_DELIVERY',
      'OUT_FOR_DELIVERY',
      'DELIVERED'
    ],
    default: 'REQUEST_CREATED'
  },
  assignedDeliveryPerson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  flowType: {
    type: String,
    enum: ['standard', 'express'],
    default: 'standard'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Package', PackageSchema);

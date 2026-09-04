const Counter = require('../models/Counter');

/**
 * Atomically generates a unique sequential Package ID: PKG-YYYY-XXXXXX
 * 
 * @returns {Promise<string>} The generated Package ID.
 */
exports.generatePackageId = async () => {
  const year = new Date().getFullYear();
  const counterId = `PKG_SEQ_${year}`;

  const counter = await Counter.findOneAndUpdate(
    { _id: counterId },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Pad the sequence number to 6 digits (e.g. 000042)
  const paddedSeq = String(counter.seq).padStart(6, '0');

  return `PKG-${year}-${paddedSeq}`;
};

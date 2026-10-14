const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'indexed', 'failed'],
      default: 'uploaded',
    },
    metadata: {
      title: { type: String, default: '' },
      authors: [{ type: String }],
      publicationYear: { type: Number },
      chunkCount: { type: Number, default: 0 },
      sourceType: {
        type: String,
        enum: ['pdf_upload', 'arxiv', 'pubmed', 'web'],
        default: 'pdf_upload',
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Document', documentSchema);

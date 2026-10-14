const fs = require('fs');
const Document = require('../models/Document');
const { sendResponse } = require('../utils/apiResponse');

// @desc    Upload research paper/document (PDF/TXT)
// @route   POST /api/v1/documents/upload
// @access  Private
const uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return sendResponse(res, 400, false, 'No document file uploaded');
    }

    const { title, authors, publicationYear, sourceType } = req.body;

    const document = await Document.create({
      user: req.user._id,
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      status: 'uploaded',
      metadata: {
        title: title || req.file.originalname,
        authors: authors ? (Array.isArray(authors) ? authors : authors.split(',')) : [],
        publicationYear: publicationYear ? parseInt(publicationYear) : undefined,
        sourceType: sourceType || 'pdf_upload',
      },
    });

    return sendResponse(res, 201, true, 'Document uploaded successfully', { document });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all documents uploaded by user
// @route   GET /api/v1/documents
// @access  Private
const getDocuments = async (req, res, next) => {
  try {
    const documents = await Document.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendResponse(res, 200, true, 'Documents retrieved successfully', {
      count: documents.length,
      documents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single document by ID
// @route   GET /api/v1/documents/:id
// @access  Private
const getDocumentById = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return sendResponse(res, 404, false, 'Document not found');
    }

    return sendResponse(res, 200, true, 'Document retrieved successfully', { document });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete document
// @route   DELETE /api/v1/documents/:id
// @access  Private
const deleteDocument = async (req, res, next) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!document) {
      return sendResponse(res, 404, false, 'Document not found');
    }

    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    await document.deleteOne();

    return sendResponse(res, 200, true, 'Document deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};

const mongoose = require('mongoose');

const researchSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    researchQuestion: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        'draft',
        'planning',
        'retrieving',
        'analyzing',
        'verifying',
        'graph_building',
        'synthesizing',
        'completed',
        'failed',
      ],
      default: 'draft',
    },
    // Module 1: Research Planner Output
    plan: {
      subQueries: [{ type: String }],
      searchStrategy: { type: String, default: '' },
      plannedAt: { type: Date },
    },
    // Module 2: Information Retrieval Output
    retrievedSources: [
      {
        title: String,
        sourceType: String,
        urlOrPath: String,
        relevanceScore: Number,
        snippet: String,
      },
    ],
    // Module 3: Analysis Output
    claims: [
      {
        statement: String,
        evidence: String,
        sourceRef: String,
        confidence: Number,
      },
    ],
    // Module 4: Verification Output
    verificationResults: {
      verifiedCount: { type: Number, default: 0 },
      flaggedConflicts: [
        {
          claimA: String,
          claimB: String,
          conflictReason: String,
        },
      ],
      citationsValid: { type: Boolean, default: true },
    },
    // Module 5: Knowledge Graph Output
    knowledgeGraph: {
      nodes: [
        {
          id: String,
          label: String,
          group: String,
        },
      ],
      edges: [
        {
          source: String,
          target: String,
          relation: String,
        },
      ],
    },
    // Module 6: Synthesis Report Output
    synthesisReport: {
      summary: String,
      keyFindings: [{ type: String }],
      trendsAndGaps: [{ type: String }],
      markdownContent: String,
      generatedAt: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ResearchSession', researchSessionSchema);

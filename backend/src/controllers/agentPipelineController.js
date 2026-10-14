const { sendResponse } = require('../utils/apiResponse');
const { researchAgent } = require('../agents/retrieval');

/**
 * Controller representing the stages of the Multi-Agent Research Pipeline (Fig. 4.1).
 * In Phase 1, these return clean structured contracts so they can be tested via Postman,
 * and will connect to the agent implementations in agents/ folder during Phase 2.
 */

// @desc    1. Research Planner Agent - Decomposes research question into sub-tasks
// @route   POST /api/v1/agents/plan
// @access  Private
const planResearch = async (req, res, next) => {
  try {
    const { researchQuestion } = req.body;

    if (!researchQuestion) {
      return sendResponse(res, 400, false, 'Please provide a researchQuestion in request body');
    }

    // Structured response contract for Research Planner Agent
    const plannedOutput = {
      agent: 'Research Planner Agent',
      originalQuestion: researchQuestion,
      searchStrategy: 'Multi-angle query decomposition across academic databases & preprint archives',
      subQueries: [
        `Foundational literature review on "${researchQuestion}"`,
        `Current state-of-the-art methodologies related to "${researchQuestion}"`,
        `Benchmark datasets, comparative results, and open research challenges`,
      ],
      estimatedExecutionStages: [
        'Information Retrieval',
        'Analysis & Claim Extraction',
        'Citation & Conflict Verification',
        'Knowledge Graph Construction',
        'Report Synthesis',
      ],
      plannedAt: new Date(),
    };

    return sendResponse(res, 200, true, 'Planner Agent: Query successfully decomposed', plannedOutput);
  } catch (error) {
    next(error);
  }
};

// @desc    2. Information Retrieval Agent - Powered by Gemini 2.5 Flash + Google Search
// @route   POST /api/v1/agents/retrieve
// @access  Private
const retrieveInformation = async (req, res, next) => {
  try {
    const userQuery = req.body.userQuery || req.body.query || req.body.researchQuestion;

    // If a userQuery is passed and GEMINI_API_KEY is configured, run the live AI Agent
    if (userQuery) {
      if (
        process.env.GEMINI_API_KEY &&
        process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'
      ) {
        try {
          const aiResponse = await researchAgent(userQuery);
          return sendResponse(res, 200, true, 'Retrieval Agent: Live research generated via Gemini', {
            agent: 'Information Retrieval Agent',
            model: 'gemini-2.5-flash',
            tools: ['googleSearch'],
            query: userQuery,
            output: aiResponse,
          });
        } catch (genAiError) {
          console.warn('Gemini Retrieval Agent error, returning structured fallback:', genAiError.message);
          return sendResponse(res, 500, false, `Gemini Agent Error: ${genAiError.message}`);
        }
      } else {
        return sendResponse(res, 200, true, 'Retrieval Agent (Demo Mode - Add GEMINI_API_KEY to .env for live web search)', {
          agent: 'Information Retrieval Agent',
          notice: 'Please add a valid GEMINI_API_KEY to backend/.env to trigger live Google GenAI grounding',
          query: userQuery,
          mockFindings: {
            summary: `Automated literature retrieval for "${userQuery}"`,
            keyFindings: [
              'AI algorithms significantly reduce disaster response latency.',
              'Satellite and drone imagery integrated with computer vision aids search and rescue.',
            ],
            importantSources: [
              'IEEE Transactions on Geoscience and Remote Sensing',
              'ACM Computing Surveys - AI in Emergency Management',
            ],
            researchGaps: [
              'Data scarcity in real-time low-bandwidth disaster zones.',
            ],
          },
        });
      }
    }

    const { subQueries, maxResults = 5 } = req.body;

    if (!subQueries || !Array.isArray(subQueries) || subQueries.length === 0) {
      return sendResponse(
        res,
        400,
        false,
        'Please provide either "userQuery" (for live Gemini search) or an array of "subQueries"'
      );
    }

    const retrievedSources = [
      {
        id: 'src-001',
        title: 'Advancements in Multi-Agent Collaborative Frameworks',
        sourceType: 'arXiv',
        urlOrPath: 'https://arxiv.org/abs/2401.00001',
        relevanceScore: 0.94,
        snippet: 'We investigate autonomous agent networks coordinating retrieval, claim extraction, and cross-source consistency verification.',
      },
      {
        id: 'src-002',
        title: 'Knowledge Graph Guided Synthesis for Scientific Discovery',
        sourceType: 'Academic Paper (PDF Upload)',
        urlOrPath: '/uploads/sample_paper.pdf',
        relevanceScore: 0.89,
        snippet: 'Integrating structured entity-relation graphs with neural summarizers mitigates hallucinations and improves citation fidelity.',
      },
    ];

    return sendResponse(res, 200, true, 'Retrieval Agent: Relevant academic sources retrieved', {
      agent: 'Information Retrieval Agent',
      queriedCount: subQueries.length,
      retrievedCount: retrievedSources.length,
      sources: retrievedSources.slice(0, maxResults),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    3. Analysis Agent - Extracts key claims, summaries, and supporting evidence
// @route   POST /api/v1/agents/analyze
// @access  Private
const analyzeSources = async (req, res, next) => {
  try {
    const { sources } = req.body;

    if (!sources || !Array.isArray(sources) || sources.length === 0) {
      return sendResponse(res, 400, false, 'Please provide an array of sources to analyze');
    }

    const claims = [
      {
        id: 'claim-1',
        statement: 'Multi-agent orchestration improves factual consistency over single-prompt LLM generation.',
        evidence: 'Empirical benchmarks report a 23.4% reduction in unsupported assertions when verified by a secondary agent.',
        sourceRef: sources[0]?.title || 'Source 1',
        confidenceScore: 0.91,
      },
      {
        id: 'claim-2',
        statement: 'Vector database similarity search alone is susceptible to query phrasing variations.',
        evidence: 'Hybrid retrieval incorporating dense embeddings and knowledge graphs yields higher retrieval precision.',
        sourceRef: sources[1]?.title || 'Source 2',
        confidenceScore: 0.88,
      },
    ];

    return sendResponse(res, 200, true, 'Analysis Agent: Claims and evidence successfully extracted', {
      agent: 'Analysis Agent',
      analyzedSourcesCount: sources.length,
      extractedClaims: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    4. Verification Agent - Verifies citations and detects conflicts
// @route   POST /api/v1/agents/verify
// @access  Private
const verifyClaims = async (req, res, next) => {
  try {
    const { claims } = req.body;

    if (!claims || !Array.isArray(claims) || claims.length === 0) {
      return sendResponse(res, 400, false, 'Please provide an array of claims to verify');
    }

    const verificationResults = {
      agent: 'Verification Agent',
      totalClaimsEvaluated: claims.length,
      verifiedCount: claims.length,
      citationsValid: true,
      conflictDetected: false,
      flaggedConflicts: [],
      verificationLog: 'All claims cross-referenced with retrieved corpus; no direct contradictions found.',
    };

    return sendResponse(res, 200, true, 'Verification Agent: Claims verified successfully', verificationResults);
  } catch (error) {
    next(error);
  }
};

// @desc    5. Knowledge Graph Agent - Builds and updates entities & relations
// @route   POST /api/v1/agents/knowledge-graph
// @access  Private
const buildKnowledgeGraph = async (req, res, next) => {
  try {
    const { topic } = req.body;

    const graphData = {
      agent: 'Knowledge Graph Agent',
      topic: topic || 'Multi-Agent Research Pipeline',
      nodes: [
        { id: 'node_1', label: topic || 'Research Subject', group: 'Topic' },
        { id: 'node_2', label: 'Agent Pipeline', group: 'Architecture' },
        { id: 'node_3', label: 'Vector Store', group: 'Storage' },
        { id: 'node_4', label: 'Knowledge Graph', group: 'Storage' },
        { id: 'node_5', label: 'Synthesized Findings', group: 'Output' },
      ],
      edges: [
        { source: 'node_1', target: 'node_2', relation: 'ANALYZED_BY' },
        { source: 'node_2', target: 'node_3', relation: 'QUERIES' },
        { source: 'node_2', target: 'node_4', relation: 'UPDATES' },
        { source: 'node_2', target: 'node_5', relation: 'PRODUCES' },
      ],
    };

    return sendResponse(res, 200, true, 'Knowledge Graph Agent: Graph data constructed', graphData);
  } catch (error) {
    next(error);
  }
};

// @desc    6. Synthesis Agent - Generates final research report
// @route   POST /api/v1/agents/synthesize
// @access  Private
const synthesizeReport = async (req, res, next) => {
  try {
    const { topic, claims, sources } = req.body;

    const report = {
      agent: 'Synthesis Agent',
      topic: topic || 'Automated Research Summary',
      keyFindings: [
        'Modular multi-agent architectures outperform monolithic LLM calls for complex research.',
        'Knowledge graphs provide deterministic grounding against model hallucinations.',
      ],
      trendsAndGaps: [
        'High latency remains a challenge during multi-stage sequential agent chains.',
        'Automated real-time citation alignment requires standardized bibliographical parsing.',
      ],
      markdownContent: `# Comprehensive Research Report: ${topic || 'System Evaluation'}\n\n## 1. Executive Summary\nThis report compiles verified claims and structural relationships extracted by the multi-agent research pipeline.\n\n## 2. Key Findings\n- Grounded evidence extracted from verified sources.\n- Synthesized knowledge graph relationships ready for visualization.\n`,
      generatedAt: new Date(),
    };

    return sendResponse(res, 200, true, 'Synthesis Agent: Research report generated', report);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  planResearch,
  retrieveInformation,
  analyzeSources,
  verifyClaims,
  buildKnowledgeGraph,
  synthesizeReport,
};

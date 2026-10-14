const express = require('express');
const router = express.Router();
const {
  planResearch,
  retrieveInformation,
  analyzeSources,
  verifyClaims,
  buildKnowledgeGraph,
  synthesizeReport,
} = require('../controllers/agentPipelineController');
const { protect } = require('../middlewares/authMiddleware');

// All agent stage routes protected by JWT
router.use(protect);

router.post('/plan', planResearch);
router.post('/retrieve', retrieveInformation);
router.post('/analyze', analyzeSources);
router.post('/verify', verifyClaims);
router.post('/knowledge-graph', buildKnowledgeGraph);
router.post('/synthesize', synthesizeReport);

module.exports = router;

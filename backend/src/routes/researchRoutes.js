const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  executePipeline,
} = require('../controllers/researchController');
const { protect } = require('../middlewares/authMiddleware');

router.use(protect);

router.post('/sessions', createSession);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSessionById);
router.post('/sessions/:id/execute', executePipeline);

module.exports = router;

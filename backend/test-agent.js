const dotenv = require('dotenv');
dotenv.config();

const { researchAgent } = require('./src/agents/retrieval');

async function main() {
  console.log('🤖 Running Retrieval Agent test with Gemini 2.5 Flash...\n');

  const query = 'What are the applications of Artificial Intelligence in disaster management?';
  console.log(`Query: "${query}"\n`);

  try {
    const result = await researchAgent(query);
    console.log('------------------- AGENT RESULT -------------------');
    console.log(result);
    console.log('----------------------------------------------------');
  } catch (error) {
    console.error('❌ Agent execution failed:', error.message);
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('\n💡 Tip: Please set your valid GEMINI_API_KEY inside backend/.env and re-run.');
    }
  }
}

main();

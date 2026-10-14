const { GoogleGenAI } = require('@google/genai');

/**
 * Module 2: Information Retrieval Agent (Powered by Gemini & Google Search Grounding)
 * 
 * Responsibility:
 * - Searches and retrieves relevant academic & web research information using Google GenAI
 * - Grounds responses using Google Search
 * - Synthesizes Research Summary, Key Findings, Important Sources, and Research Gaps
 */

const context = `
You are an AI Research Agent.

Your task is to help users perform academic research.

You should:
- Find relevant and recent information.
- Analyze the information.
- Give reliable answers.
- Mention important sources.
- Do not make up information.

Research domain:
Computer Science and Artificial Intelligence.

Target audience:
College students and researchers.
`;

class RetrievalAgent {
  /**
   * Executes research retrieval for a given query
   * @param {string} userQuery
   * @returns {Promise<string>}
   */
  async execute(userQuery) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      throw new Error(
        'GEMINI_API_KEY is missing or not set in backend/.env. Please add your Gemini API key to run live retrieval.'
      );
    }

    const ai = new GoogleGenAI({
      apiKey,
    });

    const prompt = `
${context}

User Research Question:
${userQuery}

Provide:
1. Research Summary
2. Key Findings
3. Important Sources
4. Research Gaps
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [
          {
            googleSearch: {},
          },
        ],
      },
    });

    return response.text;
  }
}

const retrievalAgentInstance = new RetrievalAgent();

module.exports = {
  RetrievalAgent,
  retrievalAgent: retrievalAgentInstance,
  researchAgent: (query) => retrievalAgentInstance.execute(query),
};

const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateGeminiResponse = async (prompt) => {
  try {
    console.log('Generating response with prompt:', prompt);
    console.log('API Key present:', !!process.env.GEMINI_API_KEY);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content directly with the prompt
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Generated response:', text);
    return text;

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Gemini API Error: ${error.message}`);
  }
};

module.exports = {
  generateGeminiResponse
};
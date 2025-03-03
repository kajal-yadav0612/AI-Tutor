const { generateGeminiResponse } = require('../services/geminiService');

const generateResponse = async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));

    const { prompt, subject } = req.body;

    // Validate request
    if (!prompt) {
      return res.status(400).json({ 
        error: 'Missing prompt',
        message: 'Prompt is required'
      });
    }

    if (!subject || !subject.subject || !subject.topic) {
      return res.status(400).json({ 
        error: 'Invalid subject format',
        message: 'Subject must include subject and topic',
        received: subject
      });
    }

    // Generate context-aware prompt
    const fullPrompt = `
      As an AI tutor teaching ${subject.subject} - ${subject.topic}, 
      ${prompt}
      
      Format your response in a clear, educational manner.
      Include relevant examples and explanations.
    `;

    console.log('Sending prompt to Gemini:', fullPrompt);

    // Get response from Gemini
    const response = await generateGeminiResponse(fullPrompt);

    console.log('Received response from Gemini:', response);

    // Send response
    res.json({
      text: response,
      sections: {
        explanation: response,
        example: null,
        practice: null
      }
    });

  } catch (error) {
    console.error('Error in generateResponse:', error);
    res.status(500).json({ 
      error: 'Failed to generate response',
      message: error.message
    });
  }
};

module.exports = {
  generateResponse
};
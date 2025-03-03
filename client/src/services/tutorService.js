const API_URL = 'http://localhost:5000/api/tutor';

export const generateTutorResponse = async (prompt, subject) => {
  try {
    console.log('Sending request to server...', { prompt, subject }); // Debug log
    
    const response = await fetch('http://localhost:5000/api/tutor/generate-response', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        subject
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.message || 'Server error');
    }

    const data = await response.json();
    console.log('Server response:', data); // Debug log
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

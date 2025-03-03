import { useState } from 'react';
import TutorChat from './components/Tutorchat/TutorChat';
import { FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import './App.css';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);

  const chapters = [
    {
      number: 1,
      title: "Introduction to NLP",
      description: "Fundamentals of Natural Language Processing",
      topics: [
        "Definition & Importance of NLP",
        "Applications of NLP",
        "Basic NLP Tasks",
        "Challenges in NLP",
        "Types of NLP Techniques"
      ],
      prompt: `You are an expert NLP professor teaching a beginner student. Speak naturally as if in a real classroom. Important: Do not read out special characters or symbols (like #, *, etc.) as words - simply ignore them if they appear. Deliver a conversational 30-minute lecture on Introduction to NLP. 

Start by explaining what NLP is and why it's important in AI. Cover real-world applications like chatbots, sentiment analysis, machine translation, and speech recognition. Then explain fundamental NLP tasks such as tokenization, stemming, lemmatization, and part-of-speech tagging with examples. Discuss common challenges in NLP, like ambiguity, context understanding, and sarcasm detection. Finally, compare rule-based, statistical, and deep learning-based techniques, explaining how they work and their advantages and limitations. Use natural language throughout, as if speaking to students in a classroom. Try to explain the concepts and explain in detail`
    },
    {
      number: 2,
      title: "Text Processing & Feature Engineering",
      description: "Essential text preprocessing and feature extraction techniques",
      topics: [
        "Text Cleaning Techniques",
        "Tokenization",
        "Stemming vs. Lemmatization",
        "POS Tagging",
        "Named Entity Recognition",
        "TF-IDF & Word Embeddings"
      ],
      prompt: `You are a skilled NLP instructor teaching a student about text processing. Speak naturally as in a real classroom setting. Important: If you see any special characters or symbols (like #, *, etc.), do not read them out as words - simply skip them. Present an engaging 30-minute lesson. Let's use these visual aids:


Begin by explaining why text preprocessing is essential in NLP. Cover text-cleaning techniques like lowercasing, stopword removal, punctuation handling, and whitespace normalization. Explain tokenization—both word and sentence tokenization—with practical examples. Discuss stemming and lemmatization, their differences, and use cases. Introduce Part-of-Speech tagging and Named Entity Recognition, explaining how they help understand language structure. Finally, teach feature extraction methods like TF-IDF and word embeddings. Use conversational language and clear examples throughout.Try to explain the concepts and explain in detail`
    },
    {
      number: 3,
      title: "NLP Models and Architectures",
      description: "Deep dive into various NLP model architectures",
      topics: [
        "Traditional NLP Models",
        "Neural Networks in NLP",
        "Transformers and Attention",
        "Pretraining and Fine-Tuning",
        "Word Embeddings vs. Contextual Embeddings"
      ],
      prompt: `You are a knowledgeable NLP professor teaching advanced students about NLP models. Speak naturally as in a lecture hall. Important: When encountering special characters or symbols (like #, *, etc.), do not pronounce them - just ignore them. Let's use these visual aids in our discussion:


Begin with traditional NLP models like n-grams, Hidden Markov Models, and Conditional Random Fields. Explain their principles, strengths, and limitations. Introduce neural networks in NLP, focusing on Recurrent Neural Networks and their importance for sequential data. Explore LSTM and GRU, explaining how they handle the vanishing gradient problem. Present the Transformer architecture and its attention mechanism. Use natural, conversational language throughout the lecture.Try  to explain the concepts and explain in detail`
    },
    {
      number: 4,
      title: "Advanced NLP & Applications",
      description: "Real-world applications and deployment",
      topics: [
        "Sentiment Analysis",
        "Chatbots & Conversational AI",
        "Text Summarization",
        "Machine Translation",
        "Ethics & Bias in NLP",
        "Deployment of NLP Models"
      ],
    
      prompt: `You are an experienced NLP mentor teaching aspiring AI developers about advanced applications. Speak naturally as if in a professional workshop. Important: If you encounter any special characters or symbols (like #, *, etc.), do not read them aloud - simply skip over them. 

Begin with sentiment analysis, covering its applications in business, social media, and customer feedback. Explain different approaches including rule-based, ML-based, and deep learning methods. Discuss chatbots and conversational AI, including intent recognition, dialogue management, and response generation. Use natural, professional language throughout, as if teaching in a real-world setting.Try  to explain the concepts and explain in detail`
    }
  ];

  if (!isStarted) {
    return (
      <div className="welcome-screen">
        <div className="logo-container">
          <FaGraduationCap className="teacher-logo" />
        </div>
        <h1>AI Personal Tutor</h1>
        <p>Your personalized learning journey begins here</p>
        <button className="start-button" onClick={() => setIsStarted(true)}>
          Start Learning <FaArrowRight className="arrow-icon" />
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <FaGraduationCap className="header-logo" />
          <h1>NLP Learning Assistant</h1>
        </div>
      </header>

      <main className="app-main">
        {selectedChapter ? (
          <TutorChat 
            subject={{ 
              subject: `Chapter ${selectedChapter.number}`, 
              topic: selectedChapter.title,
              topics: selectedChapter.topics,
              images: selectedChapter.images,
              prompt: selectedChapter.prompt
            }} 
            onBack={() => setSelectedChapter(null)} 
          />
        ) : (
          <div className="chapters-container">
            <h2>NLP Course Chapters</h2>
            <div className="chapters-grid">
              {chapters.map((chapter) => (
                <div 
                  key={chapter.number} 
                  className="chapter-card"
                  onClick={() => setSelectedChapter(chapter)}
                >
                  <div className="chapter-number">Chapter {chapter.number}</div>
                  <h3>{chapter.title}</h3>
                  <p>{chapter.description}</p>
                  <div className="topics-preview">
                    {chapter.topics.map((topic, index) => (
                      <span key={index} className="topic-tag">{topic}</span>
                    ))}
                  </div>
                  <button className="chapter-button">
                    Start Chapter <FaArrowRight />
                    </button>
                </div>
              ))}
              </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

import { useState, useRef, useEffect } from 'react';
import { 
  FaGraduationCap, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaArrowLeft,
  FaPlay,
  FaPause,
  FaStepBackward,
  FaStepForward,
  FaArrowRight,
  FaFlag,
  FaShare,
  FaBook,
  FaLightbulb,
  FaQuestionCircle
} from 'react-icons/fa';
import { generateTutorResponse } from '../../services/tutorService';
import './TutorChat.css';

const TOTAL_DURATION = 30 * 60; // 30 minutes in seconds

const TutorChat = ({ subject, onBack }) => {
  const [currentSentence, setCurrentSentence] = useState('');
  const [previousSentences, setPreviousSentences] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [error, setError] = useState(null);

  const contentRef = useRef(null);
  const synth = window.speechSynthesis;
  const utteranceRef = useRef(null);
  const sentencesRef = useRef([]);
  const timerRef = useRef(null);
  const currentIndexRef = useRef(0);

  // Add new state for tracking all spoken sentences
  const [allSpokenSentences, setAllSpokenSentences] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const SENTENCES_PER_PAGE = 10;

  // Add ref for auto-scrolling
  const activeLineRef = useRef(null);

  const [activeTab, setActiveTab] = useState('content');

  // Add state for simplified content
  const [simplifiedContent, setSimplifiedContent] = useState('');

  useEffect(() => {
    startChapter();
    return () => {
      if (utteranceRef.current) synth.cancel();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [subject]);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isSpeaking && !isPaused) {
      timer = setInterval(() => {
        setElapsedTime(prev => {
          if (prev >= TOTAL_DURATION) {
            clearInterval(timer);
            return prev;
          }
          return prev + 1;
        });
      }, 1000); // Update every second exactly
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSpeaking, isPaused]);

  // Add auto-scroll effect
  useEffect(() => {
    if (activeLineRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [currentSentence]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Function to process text and identify questions
  const processText = (text) => {
    // Split text into sentences and mark questions
    return text.split(/(?<=[.!?])\s+/).map(sentence => {
      const isQuestion = sentence.trim().endsWith('?');
      return {
        text: sentence.trim(),
        isQuestion
      };
    });
  };

  // Modify startChapter function
  const startChapter = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentSentence('');
      setPreviousSentences([]);
      setElapsedTime(0);
      currentIndexRef.current = 0;
      setIsPaused(false);

      const response = await generateTutorResponse(subject.prompt, subject);
      
      if (!response || !response.text) {
        throw new Error('Invalid response from server');
      }

      // Process the text
      const cleanText = response.text
        .replace(/[-*_#]/g, '')
        .replace(/\n\n/g, '. ')
        .replace(/\n/g, '. ');

      // Process text and identify questions
      sentencesRef.current = processText(cleanText);

      if (sentencesRef.current.length === 0) {
        throw new Error('No content to speak');
      }

      setIsLoading(false);
      startSpeaking(0);

    } catch (error) {
      console.error('Error in startChapter:', error);
      setError('Failed to load chapter content. Please try again.');
      setIsLoading(false);
    }
  };

  const startSpeaking = (startIndex = 0) => {
    if (utteranceRef.current) synth.cancel();
    currentIndexRef.current = startIndex;

    // Calculate initial progress based on index
    const progress = (startIndex / sentencesRef.current.length) * TOTAL_DURATION;
    setElapsedTime(progress);

    const speakNextSentence = (index) => {
      if (index < sentencesRef.current.length) {
        const sentence = sentencesRef.current[index].text.replace(/#/g, '');
        const utterance = new SpeechSynthesisUtterance(sentence);
        utteranceRef.current = utterance;

        // Get available voices
        const voices = synth.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Natural') ||
          voice.name.includes('English')
        ) || voices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => {
          setCurrentSentence(sentence);
          // Add sentence to allSpokenSentences
          setAllSpokenSentences(prev => {
            const newSentences = [...prev];
            newSentences[index] = sentence;
            return newSentences;
          });
          setCurrentPage(Math.floor(index / SENTENCES_PER_PAGE));
          setIsSpeaking(true);
        };

        utterance.onend = () => {
          if (!isPaused && index < sentencesRef.current.length - 1) {
            currentIndexRef.current = index + 1;
            speakNextSentence(index + 1);
          } else {
            setIsSpeaking(false);
            setCurrentSentence('');
          }
        };

        synth.speak(utterance);
      }
    };

    if (!isPaused) {
      speakNextSentence(startIndex);
    }
  };

  const togglePlayPause = () => {
    if (isPaused) {
      setIsPaused(false);
      // Resume speaking from current sentence
      if (currentSentence) {
        const utterance = new SpeechSynthesisUtterance(currentSentence);
        utteranceRef.current = utterance;
        utterance.onend = () => {
          currentIndexRef.current += 1;
          startSpeaking(currentIndexRef.current);
        };
        synth.speak(utterance);
      }
    } else {
      setIsPaused(true);
      synth.cancel(); // Stop current speech
    }
  };

  const jumpToSection = (direction) => {
    const newIndex = direction === 'forward' 
      ? Math.min(currentIndexRef.current + 1, sentencesRef.current.length - 1)
      : Math.max(currentIndexRef.current - 1, 0);
    
    if (utteranceRef.current) synth.cancel();
    startSpeaking(newIndex);
  };

  // Add page navigation functions
  const goToPage = (pageNumber) => {
    const newIndex = pageNumber * SENTENCES_PER_PAGE;
    if (newIndex >= 0 && newIndex < sentencesRef.current.length) {
      if (utteranceRef.current) synth.cancel();
      setCurrentPage(pageNumber);
      startSpeaking(newIndex);
    }
  };

  // Modify the generateSimplifiedContent function to show a complete summary of the content
  const generateSimplifiedContent = () => {
    // Get all sentences from the current reference
    const allContent = sentencesRef.current;
    
    // Function to organize content into paragraphs
    const organizeContent = (sentences) => {
      let paragraphs = [];
      let currentParagraph = [];
      
      sentences.forEach(sentence => {
        const text = sentence.text.trim();
        
        // Start new paragraph if it's a question or ends with a significant break
        if (sentence.isQuestion || text.endsWith(':')) {
          if (currentParagraph.length > 0) {
            paragraphs.push(currentParagraph.join(' '));
            currentParagraph = [];
          }
          paragraphs.push(text);
        } else {
          currentParagraph.push(text);
        }
      });
      
      // Add remaining sentences
      if (currentParagraph.length > 0) {
        paragraphs.push(currentParagraph.join(' '));
      }
      
      return paragraphs;
    };

    const paragraphs = organizeContent(allContent);

    return (
      <div className="simplified-content">
        <div className="summary-document">
          <h2>Chapter Summary</h2>
          <div className="summary-content">
            {paragraphs.map((paragraph, index) => {
              // Check if the paragraph is a question
              const isQuestion = paragraph.trim().endsWith('?');
              
              return (
                <div 
                  key={index} 
                  className={`summary-paragraph ${isQuestion ? 'question-paragraph' : ''}`}
                >
                  <p>{paragraph}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Update the handleTabClick function
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'simplify') {
      // Generate summary immediately from all available content
      setSimplifiedContent(generateSimplifiedContent());
    }
  };

  // Update the content rendering
  const renderContent = () => {
    return (
      <div className="text-content">
        {allSpokenSentences
          .slice(currentPage * SENTENCES_PER_PAGE, (currentPage + 1) * SENTENCES_PER_PAGE)
          .map((sentence, index) => {
            const isQuestion = sentence.trim().endsWith('?');
            return (
              <div 
                key={index}
                ref={sentence === currentSentence ? activeLineRef : null}
                className={`sentence-container ${isQuestion ? 'question' : ''}`}
              >
                <span className={`sentence-text ${sentence === currentSentence ? 'speaking' : ''}`}>
                  {sentence}
                </span>
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <div className="tutor-layout">
      <div className="tutor-sidebar">
        <div className="course-navigation">
          <div className="sidebar-header">
            <button className="back-button" onClick={onBack}>
              <FaArrowLeft /> Back to Chapters
            </button>
          </div>
          <h3>Chapter {subject.subject}</h3>
          <div className="module-list">
            {subject.topics.map((topic, index) => (
              <div 
                key={index} 
                className={`module-item ${currentPage === index ? 'active' : ''}`}
                onClick={() => goToPage(index)}
              >
                <span className="topic-number">{index + 1}.</span>
                <span className="topic-text">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="tutor-main-content">
        <div className="content-header">
          <h1>{subject.topic}</h1>
          <div className="content-tabs">
            <button 
              className={`tab-button ${activeTab === 'content' ? 'active' : ''}`}
              onClick={() => handleTabClick('content')}
            >
              <FaBook /> Content
            </button>
            <button 
              className={`tab-button ${activeTab === 'simplify' ? 'active' : ''}`}
              onClick={() => handleTabClick('simplify')}
            >
              <FaLightbulb /> Summary
            </button>
          </div>
        </div>

        <div className="content-area">
          {isLoading ? (
            <div className="loading">
              <FaGraduationCap className="loading-logo spin" />
              <p>Preparing your lesson...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <h3>Oops! Something went wrong</h3>
              <p>{error}</p>
              <button onClick={startChapter}>Try Again</button>
            </div>
          ) : (
            <div className="lesson-content">
              <div className="scrollable-content">
                {activeTab === 'content' && renderContent()}
                {activeTab === 'simplify' && simplifiedContent}
              </div>
            </div>
          )}
        </div>

        <div className="fixed-bottom-controls">
          <div className="progress-container">
            <div className="progress-bar-wrapper">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(elapsedTime / TOTAL_DURATION) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="timeline-info">
              <div className="time-display">
                <span className="current-time">{formatTime(elapsedTime)}</span>
                <span className="time-separator">/</span>
                <span className="total-time">{formatTime(TOTAL_DURATION)}</span>
              </div>
              <div className="progress-percentage">
                {Math.round((elapsedTime / TOTAL_DURATION) * 100)}%
              </div>
            </div>

            <div className="playback-controls">
              <button 
                className="control-button"
                onClick={() => jumpToSection('backward')}
                disabled={currentIndexRef.current === 0}
              >
                <FaStepBackward />
              </button>
              <button 
                className="control-button play-pause"
                onClick={togglePlayPause}
              >
                {isSpeaking && !isPaused ? <FaPause /> : <FaPlay />}
              </button>
              <button 
                className="control-button"
                onClick={() => jumpToSection('forward')}
                disabled={currentIndexRef.current >= sentencesRef.current.length - 1}
              >
                <FaStepForward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;

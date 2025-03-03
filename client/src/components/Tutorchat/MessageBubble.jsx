import { FaVolumeUp } from 'react-icons/fa';
import VisualAid from './VisualAid';

const MessageBubble = ({ message, onReplay }) => {
  const { type, content, visuals, sections } = message;

  return (
    <div className={`message ${type}`}>
      <div className="message-header">
        {type === 'bot' && (
          <button className="replay-button" onClick={onReplay}>
            <FaVolumeUp />
          </button>
        )}
      </div>
      
      <div className="message-content">
        {sections ? (
          <>
            <div className="explanation">{sections.explanation}</div>
            {sections.example && (
              <div className="example">
                <h4>Example:</h4>
                {sections.example}
              </div>
            )}
            {visuals?.length > 0 && (
              <div className="visuals-container">
                {visuals.map((visual, idx) => (
                  <VisualAid key={idx} visual={visual} />
                ))}
              </div>
            )}
            {sections.practice && (
              <div className="practice">
                <h4>Practice:</h4>
                {sections.practice}
              </div>
            )}
            {sections.encouragement && (
              <div className="encouragement">
                {sections.encouragement}
              </div>
            )}
          </>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

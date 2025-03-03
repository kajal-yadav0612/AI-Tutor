import { useState } from 'react';
import { FaExpand } from 'react-icons/fa';

const VisualAid = ({ visual }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="visual-aid-container">
      <div 
        className={`visual-aid ${isExpanded ? 'expanded' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img 
          src={`https://placehold.co/600x400?text=${encodeURIComponent(visual.description)}`}
          alt={visual.description}
          loading="lazy"
        />
        <button className="expand-button">
          <FaExpand />
        </button>
      </div>
      <p className="visual-description">{visual.description}</p>
    </div>
  );
};

export default VisualAid;

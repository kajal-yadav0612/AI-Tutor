import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const VoiceControl = ({ isSpeaking, onToggle }) => {
  return (
    <button 
      className={`voice-control ${isSpeaking ? 'speaking' : ''}`}
      onClick={onToggle}
    >
      {isSpeaking ? <FaVolumeMute /> : <FaVolumeUp />}
    </button>
  );
};

export default VoiceControl;

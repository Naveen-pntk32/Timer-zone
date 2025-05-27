import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faPlus } from '@fortawesome/free-solid-svg-icons';

const TimerContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const ModeButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModeButton = styled.button<{ active: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? '#3498db' : '#ecf0f1'};
  color: ${props => props.active ? 'white' : '#2c3e50'};
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #3498db;
    color: white;
  }
`;

const TimerDisplay = styled.div`
  font-size: 6rem;
  font-weight: bold;
  margin: 2rem 0;
  color: #2c3e50;
`;

const TimeButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const TimeButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  background: #ecf0f1;
  color: #2c3e50;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #3498db;
    color: white;
  }
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  border-radius: 4px;
  background: #2ecc71;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #27ae60;
  }
`;

interface TimerProps {
  onTimerComplete?: () => void;
}

const Timer: React.FC<TimerProps> = ({ onTimerComplete }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [currentMode, setCurrentMode] = useState('focus');
  const [modeTimes] = useState({
    focus: 25 * 60,
    'short-break': 5 * 60,
    'long-break': 15 * 60,
  });

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Update document title with timer
  useEffect(() => {
    const formattedTime = formatTime(timeLeft);
    document.title = `${formattedTime} - PNTK Timer`;

    return () => {
      document.title = 'PNTK Timer';
    };
  }, [timeLeft, formatTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            if (onTimerComplete) {
              onTimerComplete();
            }
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onTimerComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const switchMode = (mode: string) => {
    if (isRunning) {
      if (!window.confirm('Switch mode? This will reset the current timer.')) {
        return;
      }
      setIsRunning(false);
    }
    setCurrentMode(mode);
    setTimeLeft(modeTimes[mode as keyof typeof modeTimes]);
  };

  const addTime = (minutes: number) => {
    if (!isRunning) {
      setTimeLeft(time => time + minutes * 60);
    }
  };

  return (
    <TimerContainer>
      <ModeButtons>
        <ModeButton active={currentMode === 'focus'} onClick={() => switchMode('focus')}>
          Focus
        </ModeButton>
        <ModeButton active={currentMode === 'short-break'} onClick={() => switchMode('short-break')}>
          Short Break
        </ModeButton>
        <ModeButton active={currentMode === 'long-break'} onClick={() => switchMode('long-break')}>
          Long Break
        </ModeButton>
      </ModeButtons>

      <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>

      <TimeButtons>
        <TimeButton onClick={() => addTime(25)}>
          <FontAwesomeIcon icon={faPlus} /> 25 min
        </TimeButton>
        <TimeButton onClick={() => addTime(10)}>
          <FontAwesomeIcon icon={faPlus} /> 10 min
        </TimeButton>
        <TimeButton onClick={() => addTime(5)}>
          <FontAwesomeIcon icon={faPlus} /> 5 min
        </TimeButton>
        <TimeButton onClick={() => addTime(1)}>
          <FontAwesomeIcon icon={faPlus} /> 1 min
        </TimeButton>
      </TimeButtons>

      <StartButton onClick={toggleTimer}>
        <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
        {' '}
        {isRunning ? 'Pause' : 'Start'}
      </StartButton>
    </TimerContainer>
  );
};

export default Timer; 
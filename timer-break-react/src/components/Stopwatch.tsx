import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faStop, faFlag, faRedo } from '@fortawesome/free-solid-svg-icons';

const StopwatchContainer = styled.div`
  padding: 2rem;
  text-align: center;
`;

const StopwatchDisplay = styled.div`
  font-size: 4rem;
  font-weight: bold;
  margin: 2rem 0;
  font-family: monospace;
  color: #2c3e50;
`;

const Controls = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: ${props => props.disabled ? '#95a5a6' : '#3498db'};
  color: white;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover:not(:disabled) {
    background: #2980b9;
  }
`;

const LapList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem auto;
  max-width: 400px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
`;

const LapItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #ecf0f1;

  &:last-child {
    border-bottom: none;
  }
`;

interface LapTime {
  number: number;
  totalTime: string;
  lapTime: string;
}

const Stopwatch: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const formatTime = useCallback((ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = Math.floor(ms % 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      const startTime = Date.now() - time;
      interval = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 10);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLastLapTime(0);
  };

  const handleLap = () => {
    if (isRunning) {
      const lapTime = time - lastLapTime;
      setLaps(prevLaps => [{
        number: prevLaps.length + 1,
        totalTime: formatTime(time),
        lapTime: formatTime(lapTime)
      }, ...prevLaps]);
      setLastLapTime(time);
    }
  };

  return (
    <StopwatchContainer>
      <h2>Stopwatch</h2>
      <StopwatchDisplay>{formatTime(time)}</StopwatchDisplay>
      
      <Controls>
        <ActionButton 
          onClick={handleStart} 
          disabled={isRunning}
        >
          <FontAwesomeIcon icon={faPlay} />
          {time === 0 ? 'Start' : 'Resume'}
        </ActionButton>
        
        <ActionButton 
          onClick={handleStop}
          disabled={!isRunning}
        >
          <FontAwesomeIcon icon={faStop} />
          Stop
        </ActionButton>
        
        <ActionButton 
          onClick={handleLap}
          disabled={!isRunning}
        >
          <FontAwesomeIcon icon={faFlag} />
          Lap
        </ActionButton>
        
        <ActionButton 
          onClick={handleReset}
          disabled={time === 0}
        >
          <FontAwesomeIcon icon={faRedo} />
          Reset
        </ActionButton>
      </Controls>

      {laps.length > 0 && (
        <>
          <h3>Lap Times</h3>
          <LapList>
            {laps.map((lap) => (
              <LapItem key={lap.number}>
                <span>Lap {lap.number}</span>
                <span>{lap.lapTime}</span>
                <span>{lap.totalTime}</span>
              </LapItem>
            ))}
          </LapList>
        </>
      )}
    </StopwatchContainer>
  );
};

export default Stopwatch; 
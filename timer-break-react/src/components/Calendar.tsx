import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const CalendarContainer = styled.div`
  padding: 2rem;
`;

const ScheduleForm = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  flex: 1;
`;

const AddButton = styled.button`
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 4px;
  background: #3498db;
  color: white;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: #2980b9;
  }
`;

const TaskList = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskTime = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const TaskText = styled.div`
  flex: 1;
  margin: 0 1rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s;

  &:hover {
    color: #c0392b;
  }
`;

interface ScheduledTask {
  id: string;
  task: string;
  datetime: string;
}

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<ScheduledTask[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDateTime, setNewDateTime] = useState('');

  useEffect(() => {
    const savedTasks = localStorage.getItem('scheduledTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks: ScheduledTask[]) => {
    localStorage.setItem('scheduledTasks', JSON.stringify(updatedTasks));
  };

  const handleAddTask = () => {
    if (newTask.trim() && newDateTime) {
      const newTaskItem: ScheduledTask = {
        id: Date.now().toString(),
        task: newTask.trim(),
        datetime: newDateTime
      };

      const updatedTasks = [...tasks, newTaskItem].sort(
        (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );

      setTasks(updatedTasks);
      saveTasksToLocalStorage(updatedTasks);
      setNewTask('');
      setNewDateTime('');
    }
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  const formatDateTime = (datetime: string) => {
    return new Date(datetime).toLocaleString();
  };

  return (
    <CalendarContainer>
      <h2>Schedule Tasks</h2>
      
      <ScheduleForm>
        <Input
          type="text"
          placeholder="Add a scheduled task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Input
          type="datetime-local"
          value={newDateTime}
          onChange={(e) => setNewDateTime(e.target.value)}
        />
        <AddButton onClick={handleAddTask}>
          Add to Schedule
        </AddButton>
      </ScheduleForm>

      <TaskList>
        {tasks.map((task) => (
          <TaskItem key={task.id}>
            <TaskTime>{formatDateTime(task.datetime)}</TaskTime>
            <TaskText>{task.task}</TaskText>
            <DeleteButton onClick={() => handleDeleteTask(task.id)}>
              <FontAwesomeIcon icon={faTimes} />
            </DeleteButton>
          </TaskItem>
        ))}
      </TaskList>
    </CalendarContainer>
  );
};

export default Calendar; 
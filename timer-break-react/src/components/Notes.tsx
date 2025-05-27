import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const NotesContainer = styled.div`
  padding: 2rem;
`;

const NotesTextarea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const SaveButton = styled.button`
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

const Notes: React.FC = () => {
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('taskNotes');
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

  const handleSaveNotes = () => {
    localStorage.setItem('taskNotes', notes);
  };

  return (
    <NotesContainer>
      <h2>Task Notes</h2>
      <NotesTextarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your task notes here..."
      />
      <SaveButton onClick={handleSaveNotes}>
        Save Notes
      </SaveButton>
    </NotesContainer>
  );
};

export default Notes; 
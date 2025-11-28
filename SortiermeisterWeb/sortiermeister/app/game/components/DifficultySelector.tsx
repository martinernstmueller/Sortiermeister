import Button from '@/public/Button';
import React from 'react';

type Difficulty = {
  id: string;
  label: string;
  speed: number;
};

const difficulties: Difficulty[] = [
  { id: 'easy-button', label: 'Easy', speed: 2000 },
  { id: 'medium-button', label: 'Medium', speed: 1000 },
  { id: 'hard-button', label: 'Hard', speed: 450 },
  { id: 'superhard-button', label: 'Super Hard', speed: 250 },
];

type DifficultySelectorProps = {
  setSortSpeed: (speed: number) => void;
};

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ setSortSpeed }) => (
  <div className="containers flex-container" id="buttonContainer">
    <h3 className="difficulty-title">Wähle eine Schwierigkeit aus:</h3>
    {difficulties.map(({ id, label, speed }) => (
      <Button
        key={id}
        label={label}
        onClick={() => setSortSpeed(speed)}
        className="flex-items"
      />
    ))}
  </div>
);

export default DifficultySelector;
import React, { useState, useEffect } from 'react';
import DifficultySelector from './DifficultySelector';
import GameResultPopup from './GameResultPopup';
import Box from './Box';

type Box = { num: number; color: string };

const getColor = (num: number, nums: number[]) => {
  const colors = [
    '#FF0000', '#00ffc3', '#56d381', '#00FF00', '#0000FF',
    '#4B0082', '#9400D3', '#FF0000', '#FF7F00', '#9c7aa4'
  ];
  return colors[nums.indexOf(num)];
};

const generateBoxes = (): Box[] => {
  const nums: number[] = [];
  const boxes: Box[] = [];
  while (nums.length < 10) {
    const num = Math.floor(Math.random() * 49) + 1;
    if (!nums.includes(num)) {
      nums.push(num);
      boxes.push({ num, color: getColor(num, nums) });
    }
  }
  return boxes;
};

const GamePage: React.FC = () => {
  const [playerBoxes, setPlayerBoxes] = useState<Box[]>([]);
  const [computerBoxes, setComputerBoxes] = useState<Box[]>([]);
  const [nums, setNums] = useState<number[]>([]);
  const [touch, setTouch] = useState<number | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [result, setResult] = useState<'win' | 'lose'>('win');
  const [popupVisible, setPopupVisible] = useState(false);
  const [speed, setSpeed] = useState(3000);

  useEffect(() => {
    const boxes = generateBoxes();
    setPlayerBoxes([...boxes]);
    setComputerBoxes([...boxes]);
    setNums(boxes.map(b => b.num));
  }, []);

  const checkWinner = (boxes: Box[], player: 'Computer' | 'Spieler') => {
    for (let i = 1; i < boxes.length; i++) {
      if (boxes[i - 1].num > boxes[i].num) return false;
    }
    setResult(player === 'Computer' ? 'lose' : 'win');
    setPopupVisible(true);
    setGameEnded(true);
    return true;
  };

  const handleBoxClick = (idx: number) => {
    if (gameEnded) return;
    if (touch === null) {
      setTouch(playerBoxes[idx].num);
      // Mark active box (could use a separate state for active index)
    } else {
      if (touch !== playerBoxes[idx].num) {
        // Swap numbers
        const newBoxes = [...playerBoxes];
        const activeIdx = newBoxes.findIndex(b => b.num === touch);
        [newBoxes[activeIdx].num, newBoxes[idx].num] = [newBoxes[idx].num, newBoxes[activeIdx].num];
        // Update colors
        newBoxes[activeIdx].color = getColor(newBoxes[activeIdx].num, nums);
        newBoxes[idx].color = getColor(newBoxes[idx].num, nums);
        setPlayerBoxes(newBoxes);
        setTouch(null);
        checkWinner(newBoxes, 'Spieler');
      } else {
        setTouch(null);
        // Unmark active box
      }
    }
  };

  // Computer sort logic (bubble sort animation)
  useEffect(() => {
    if (!gameEnded && touch === null && computerBoxes.length > 0) {
      let i = 1, j = 0;
      const sortStage = () => {
        if (gameEnded) return;
        if (i < computerBoxes.length) {
          if (j < i) {
            if (computerBoxes[i].num < computerBoxes[j].num) {
              const newBoxes = [...computerBoxes];
              [newBoxes[i].num, newBoxes[j].num] = [newBoxes[j].num, newBoxes[i].num];
              newBoxes[i].color = getColor(newBoxes[i].num, nums);
              newBoxes[j].color = getColor(newBoxes[j].num, nums);
              setComputerBoxes(newBoxes);
              setTimeout(sortStage, speed);
              j++;
              return;
            }
            j++;
          } else {
            j = 0;
            i++;
          }
          sortStage();
        } else {
          checkWinner(computerBoxes, 'Computer');
        }
      };
      // Start sort when speed is set (call sortStage)
      // You may want to trigger this from a button or after difficulty selection
    }
  }, [speed, computerBoxes, gameEnded, nums, touch]);

  const tryAgain = () => {
    setPopupVisible(false);
    setGameEnded(false);
    setTouch(null);
    const boxes = generateBoxes();
    setPlayerBoxes([...boxes]);
    setComputerBoxes([...boxes]);
    setNums(boxes.map(b => b.num));
    // Reset other game state as needed
  };

  return (
    <div>
      <DifficultySelector setSortSpeed={setSpeed} />
      <div className="game-board">
        <div className="human">
          {playerBoxes.map((box, idx) => (
            <Box
              key={idx}
              num={box.num}
              color={box.color}
              active={touch === box.num}
              onClick={() => handleBoxClick(idx)}
            />
          ))}
        </div>
        <div className="computer">
          {computerBoxes.map((box, idx) => (
            <Box
              key={idx}
              num={box.num}
              color={box.color}
              className="cbox"
            />
          ))}
        </div>
      </div>
      <GameResultPopup result={result} visible={popupVisible} onClose={tryAgain} />
    </div>
  );
};

export default GamePage;
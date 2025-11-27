import React from 'react';

type GameResultPopupProps = {
  result: 'win' | 'lose';
  onClose: () => void;
  visible: boolean;
};

const messages = {
  win: 'DU HAST GEWONNEN',
  lose: 'DU HAST VERLOREN',
};

const popupClass = {
  win: 'popups win-popup',
  lose: 'popups lose-popup',
};

const GameResultPopup: React.FC<GameResultPopupProps> = ({ result, onClose, visible }) => {
  if (!visible) return null;

  return (
    <div className="containers" role="dialog" aria-modal="true">
      <div className={popupClass[result]}>
        {messages[result]}
      </div>
      <button onClick={onClose}>
        CLOSE
      </button>
    </div>
  );
};

export default GameResultPopup;
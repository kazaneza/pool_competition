import React, { useState } from 'react';
import { Group, Match } from '../types';
import { RotateCcw } from 'lucide-react';

interface Props {
  group: Group;
  onUndoMatch: (match: Match) => void;
}

export const CompletedMatches: React.FC<Props> = ({ group, onUndoMatch }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');

  const completedMatches = group.matches.filter(match => match.completed);

  const getPlayerName = (playerId: number) => {
    return group.players.find(p => p.id === playerId)?.name || '';
  };

  // Check passcode
  const handlePasscodeSubmit = () => {
    if (passcode === 'kazaneza') {
      setIsAuthorized(true);
    } else {
      alert('Incorrect passcode');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">
        Completed Matches - {group.name}
      </h2>

      {/* Passcode input (only if not authorized) */}
      {!isAuthorized && (
        <div className="mb-4 text-center">
          <p className="text-gray-700 mb-2">Enter passcode to enable Undo:</p>
          <input
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 mr-2"
          />
          <button
            onClick={handlePasscodeSubmit}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      )}

      {/* Everyone sees completed matches, but Undo is disabled if not authorized */}
      <div className="space-y-3 md:space-y-4">
        {completedMatches.map(match => (
          <div
            key={match.id}
            className="bg-gray-50 rounded-lg p-3 md:p-4 flex items-center justify-between group"
          >
            <div className="flex-1 text-center">
              <span
                className={`text-sm md:text-base ${
                  match.winner === match.player1Id ? 'font-bold text-green-600' : 'text-gray-600'
                }`}
              >
                {getPlayerName(match.player1Id)}
              </span>
            </div>
            <div className="px-2 md:px-4 text-sm md:text-base text-gray-400">vs</div>
            <div className="flex-1 text-center">
              <span
                className={`text-sm md:text-base ${
                  match.winner === match.player2Id ? 'font-bold text-green-600' : 'text-gray-600'
                }`}
              >
                {getPlayerName(match.player2Id)}
              </span>
            </div>
            <button
              onClick={() => onUndoMatch(match)}
              disabled={!isAuthorized}
              className={`
                ml-2 md:ml-4 p-1.5 md:p-2 
                ${
                  isAuthorized
                    ? 'text-gray-400 hover:text-red-500'
                    : 'text-gray-300 cursor-not-allowed'
                }
                opacity-0 group-hover:opacity-100 transition-opacity
              `}
              title="Undo match result"
            >
              <RotateCcw className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        ))}
        {completedMatches.length === 0 && (
          <p className="text-center text-gray-500 text-sm md:text-base">No completed matches yet</p>
        )}
      </div>
    </div>
  );
};

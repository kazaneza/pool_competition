import React, { useState } from 'react';
import { Group, Match } from '../types';

interface Props {
  group: Group;
  onMatchComplete: (match: Match, winnerId: number) => void;
}

export const GroupFixtures: React.FC<Props> = ({ group, onMatchComplete }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');

  const pendingMatches = group.matches.filter(match => !match.completed);

  const getPlayerName = (playerId: number) => {
    return group.players.find(p => p.id === playerId)?.name || '';
  };

  // When user submits the passcode
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
        Pending Matches - {group.name} (
        {pendingMatches.length} {pendingMatches.length === 1 ? 'fixture' : 'fixtures'} remaining)
      </h2>

      {/* Passcode input (only needed if user isn't authorized yet) */}
      {!isAuthorized && (
        <div className="mb-4 text-center">
          <p className="text-gray-700 mb-2">Enter passcode to update fixtures:</p>
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

      {/* Show pending matches to everyone, but disable the Winner buttons if not authorized */}
      <div className="space-y-3 md:space-y-4">
        {pendingMatches.map(match => (
          <div key={match.id} className="bg-gray-50 rounded-lg p-3 md:p-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <div className="flex-1 text-center">
                <span className="text-sm md:text-base text-gray-800 block mb-2">
                  {getPlayerName(match.player1Id)}
                </span>
                <button
                  onClick={() => onMatchComplete(match, match.player1Id)}
                  disabled={!isAuthorized}
                  className={`px-3 py-1 md:px-4 md:py-1.5 text-sm rounded ${
                    isAuthorized
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Winner
                </button>
              </div>
              <div className="text-gray-400 text-sm md:text-base">vs</div>
              <div className="flex-1 text-center">
                <span className="text-sm md:text-base text-gray-800 block mb-2">
                  {getPlayerName(match.player2Id)}
                </span>
                <button
                  onClick={() => onMatchComplete(match, match.player2Id)}
                  disabled={!isAuthorized}
                  className={`px-3 py-1 md:px-4 md:py-1.5 text-sm rounded ${
                    isAuthorized
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Winner
                </button>
              </div>
            </div>
          </div>
        ))}
        {pendingMatches.length === 0 && (
          <p className="text-center text-gray-500">No pending matches</p>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { Group } from '../types';

interface Props {
  group: Group;
}

export const GroupStandings: React.FC<Props> = ({ group }) => {
  const sortedPlayers = [...group.players].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center text-gray-800">
        {group.name} Rankings
      </h2>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pos</th>
              <th className="px-4 md:px-6 py-2 md:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Player</th>
              <th className="px-4 md:px-6 py-2 md:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">P</th>
              <th className="px-4 md:px-6 py-2 md:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">W</th>
              <th className="px-4 md:px-6 py-2 md:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">L</th>
              <th className="px-4 md:px-6 py-2 md:py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Pts</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {sortedPlayers.map((player, index) => (
              <tr 
                key={player.id} 
                className={`hover:bg-gray-50 transition-colors border-b ${
                  index === 3 ? 'border-red-200' : 'border-gray-200'
                }`}
              >
                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-800' :
                    index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                    'text-gray-500'
                  }`}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap font-medium text-sm md:text-base text-gray-900">{player.name}</td>
                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-center text-sm text-gray-500">{player.played}</td>
                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-center text-sm text-green-600 font-medium">{player.won}</td>
                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-center text-sm text-red-600 font-medium">{player.lost}</td>
                <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-center text-sm font-bold text-blue-600">{player.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
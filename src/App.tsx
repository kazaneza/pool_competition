// src/App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Group, Match } from './types';
import { GroupStandings } from './components/GroupStandings';
import { GroupFixtures } from './components/GroupFixtures';
import { CompletedMatches } from './components/CompletedMatches';
import { Trophy, Download } from 'lucide-react';
import html2canvas from 'html2canvas';

type Tab = 'rankings' | 'fixtures' | 'completed';

function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('A');
  const [activeTab, setActiveTab] = useState<Tab>('rankings');
  const rankingsRef = useRef<HTMLDivElement>(null);

  // Fetch groups data on component mount
  useEffect(() => {
    fetch('/api/groups')
      .then(res => res.json())
      .then(data => setGroups(data))
      .catch(err => console.error('Error fetching groups data:', err));
  }, []);

  // Helper function to save groups data to the backend
  const saveGroups = async (updatedGroups: Group[]) => {
    try {
      await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGroups)
      });
    } catch (err) {
      console.error('Error saving groups data:', err);
    }
  };

  const handleMatchComplete = (match: Match, winnerId: number) => {
    setGroups(currentGroups => {
      const updatedGroups = currentGroups.map(group => {
        if (group.id !== match.groupId) return group;

        const updatedMatches = group.matches.map(m =>
          m.id === match.id ? { ...m, completed: true, winner: winnerId } : m
        );

        const updatedPlayers = group.players.map(player => {
          if (player.id !== match.player1Id && player.id !== match.player2Id) return player;

          const isWinner = player.id === winnerId;
          return {
            ...player,
            played: player.played + 1,
            won: isWinner ? player.won + 1 : player.won,
            lost: isWinner ? player.lost : player.lost + 1,
            points: isWinner ? player.points + 1 : player.points
          };
        });

        return {
          ...group,
          matches: updatedMatches,
          players: updatedPlayers
        };
      });
      saveGroups(updatedGroups);
      return updatedGroups;
    });
  };

  const handleUndoMatch = (match: Match) => {
    setGroups(currentGroups => {
      const updatedGroups = currentGroups.map(group => {
        if (group.id !== match.groupId) return group;

        const updatedMatches = group.matches.map(m =>
          m.id === match.id ? { ...m, completed: false, winner: undefined } : m
        );

        const updatedPlayers = group.players.map(player => {
          if (player.id !== match.player1Id && player.id !== match.player2Id) return player;

          const wasWinner = player.id === match.winner;
          return {
            ...player,
            played: player.played - 1,
            won: wasWinner ? player.won - 1 : player.won,
            lost: wasWinner ? player.lost : player.lost - 1,
            points: wasWinner ? player.points - 1 : player.points
          };
        });

        return {
          ...group,
          matches: updatedMatches,
          players: updatedPlayers
        };
      });
      saveGroups(updatedGroups);
      return updatedGroups;
    });
  };

  const downloadRankings = async () => {
    if (rankingsRef.current) {
      const canvas = await html2canvas(rankingsRef.current);
      const link = document.createElement('a');
      link.download = `group-${selectedGroup}-rankings.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const currentGroup = groups.find(g => g.id === selectedGroup) || { id: '', name: '', players: [], matches: [] };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <Trophy className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 mr-2" />
          <h1 className="text-xl md:text-3xl font-bold text-gray-800 text-center">Bank of Kigali Pool Tournament</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-4 md:mb-6">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`flex-1 px-3 py-2 md:px-4 md:py-2 rounded text-sm md:text-base ${
                selectedGroup === group.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-50'
              }`}
            >
              Group {group.id}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4 md:mb-6">
          <div className="flex border-b">
            {(['rankings', 'fixtures', 'completed'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 px-3 py-2 md:px-6 md:py-3 text-center capitalize text-sm md:text-base ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'rankings' && (
          <div className="relative">
            <button
              onClick={downloadRankings}
              className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm md:text-base"
            >
              <Download className="w-4 h-4 mr-1 md:mr-2" />
              Download Rankings
            </button>
            <div ref={rankingsRef}>
              <GroupStandings group={currentGroup} />
            </div>
          </div>
        )}

        {activeTab === 'fixtures' && (
          <GroupFixtures 
            group={currentGroup}
            onMatchComplete={handleMatchComplete}
          />
        )}

        {activeTab === 'completed' && (
          <CompletedMatches 
            group={currentGroup} 
            onUndoMatch={handleUndoMatch}
          />
        )}
      </div>
    </div>
  );
}

export default App;

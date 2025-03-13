import { Group, Player, Match } from './types';

// Generate all possible matches for a group
const generateMatches = (players: Player[], groupId: string): Match[] => {
  const matches: Match[] = [];
  let matchId = 1;

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      matches.push({
        id: matchId++,
        player1Id: players[i].id,
        player2Id: players[j].id,
        completed: false,
        groupId
      });
    }
  }

  return matches;
};

const groupParticipants = {
  'A': [
    'Bienvenue',
    'Kazaneza Gentil (BK)',
    'Philbert',
    'Richard Ntaganira',
    'EddyKaba',
    'Wilson',
    'Ishimwe A.',
    'Ivan K',
    'Gentil (BKGI)',
    'Yusufu Banki ya Kigali',
    'Gaston Impano'
  ],
  'B': [
    'Rodrigue (BK)',
    'Cedric H',
    'Ricky (BK)',
    'Juma BK',
    'Eric bk kayonza',
    'JClaude',
    'Maurice',
    'Ruzindaza',
    'Nzakamwita',
    'fredy',
    'Denis R (BK)'
  ],
  'C': [
    'Gad',
    'Alain R.',
    'Seboliver',
    'herve',
    'Ivan',
    'Akili',
    'Ishimwe Raymond',
    'Maxime T.',
    'Bahizi',
    'Thomas',
    'Bruce (BK)'
  ],
  'D': [
    'I. Bruce (BK)',
    'Celestin',
    'Omer Nd',
    'Gerald (BK)',
    'Samuel Mutinda',
    'Deo (BK)',
    'Maxime G.',
    'Olivier Mugambira',
    'Paci(BK)',
    'Eugene (BK)',
    'Herbert (BK)'
  ]
};

// Initialize groups with players and matches
export const initialGroups: Group[] = ['A', 'B', 'C', 'D'].map((groupName) => {
  const players = groupParticipants[groupName].map((name, index) => ({
    id: (Object.keys(groupParticipants).indexOf(groupName) * 11) + index + 1,
    name,
    played: 0,
    won: 0,
    lost: 0,
    points: 0
  }));

  return {
    id: groupName,
    name: `Group ${groupName}`,
    players,
    matches: generateMatches(players, groupName)
  };
});
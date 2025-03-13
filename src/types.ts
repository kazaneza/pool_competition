export interface Player {
  id: number;
  name: string;
  played: number;
  won: number;
  lost: number;
  points: number;
}

export interface Match {
  id: number;
  player1Id: number;
  player2Id: number;
  completed: boolean;
  winner?: number;
  groupId: string;
}

export interface Group {
  id: string;
  name: string;
  players: Player[];
  matches: Match[];
}
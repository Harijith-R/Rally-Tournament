export type GroupId = 'A' | 'B';

export type EmblemVariant = 'chevron' | 'shield' | 'diamond' | 'crest' | 'wings' | 'prism';

export interface TournamentGroupMeta {
  id: GroupId;
  name: string;
  teamIds: string[];
  playerCount: number;
}

export interface ChampionInfo {
  announced: boolean;
  headline: string;
  teamId: string | null;
  finalScore: string | null;
  matchId: string | null;
  crownedDate: string | null;
  summary: string | null;
  photos: Array<{ url: string; caption: string }>;
}

export interface TournamentData {
  id: string;
  name: string;
  brand: string;
  tagline: string;
  subtitle: string;
  description: string;
  year: number;
  format: string;
  stats: {
    teams: number;
    players: number;
    groups: number;
    playersPerGroup: number;
    winningPoints: number;
  };
  eliminationMilestones: number[];
  groups: TournamentGroupMeta[];
  champion: ChampionInfo;
  assets?: {
    trophyGlbUrl?: string | null;
  };
}

export interface Team {
  id: string;
  number: number;
  code: string;
  name: string;
  group: GroupId;
  playerCount: number;
  color: string;
  accentTint: string;
  emblemVariant: EmblemVariant;
}

export interface TeamsPayload {
  tournamentId: string;
  totalTeams: number;
  teams: Team[];
}

export interface Player {
  id: string;
  name: string;
  teamId: string;
  teamNumber: number;
  teamName: string;
  group: GroupId;
  order: number;
  initials: string;
}

export interface PlayersPayload {
  tournamentId: string;
  totalPlayers: number;
  players: Player[];
}

export interface FixtureMatch {
  id: string;
  matchNumber: number;
  group: GroupId | 'Knockout' | 'Final';
  teamAId: string;
  teamBId: string;
  date: string;
  time: string;
  court: string;
  status: 'upcoming' | 'completed';
}

export interface FixturesPayload {
  tournamentId: string;
  status: 'pending' | 'active' | 'completed';
  emptyHeadline: string;
  emptyDescription: string;
  matches: FixtureMatch[];
}

export interface MatchEliminationEvent {
  milestone: 25 | 50 | 75;
  teamId: string;
  eliminatedPlayerId: string;
  replacementPlayerId: string;
  scoreAtEvent?: string;
}

export interface MatchSubstitutionEvent {
  teamId: string;
  playerOutId: string;
  playerInId: string;
  scoreAtEvent?: string;
}

export interface MatchProgressionPoint {
  checkpoint: string;
  teamAScore: number;
  teamBScore: number;
}

export interface ResultMatch {
  id: string;
  matchNumber: number;
  group: GroupId | 'Knockout' | 'Final';
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  winnerTeamId: string;
  date: string;
  summary: string;
  participation?: {
    teamAPlayerIds: string[];
    teamBPlayerIds: string[];
  };
  eliminations?: MatchEliminationEvent[];
  substitutions?: MatchSubstitutionEvent[];
  progression?: MatchProgressionPoint[];
}

export interface ResultsPayload {
  tournamentId: string;
  status: 'pending' | 'active' | 'completed';
  emptyHeadline: string;
  emptyDescription: string;
  matches: ResultMatch[];
}

export interface StandingEntry {
  teamId: string;
  position: number | null;
  played: number;
  won: number;
  lost: number;
  points: number | null;
}

export interface StandingsPayload {
  tournamentId: string;
  status: 'pending' | 'active' | 'completed';
  pointsSystemConfirmed: boolean;
  pointsSystemNote: string;
  groups: {
    A: StandingEntry[];
    B: StandingEntry[];
  };
  overall: StandingEntry[];
}

export interface RuleMilestone {
  points: number;
  title: string;
  subtitle: string;
  description: string;
  type: 'elimination' | 'victory';
}

export interface OfficialRule {
  number: number;
  category: string;
  title: string;
  text: string;
}

export interface RulesPayload {
  tournamentId: string;
  formatOverview: {
    discipline: string;
    onCourtPerTeam: number;
    startingScore: string;
    winningTarget: number;
    summary: string;
  };
  milestones: RuleMilestone[];
  officialRules: OfficialRule[];
}

export interface RallyDataset {
  tournament: TournamentData;
  teams: Team[];
  players: Player[];
  fixtures: FixturesPayload;
  results: ResultsPayload;
  standings: StandingsPayload;
  rules: RulesPayload;
}

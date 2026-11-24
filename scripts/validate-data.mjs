import fs from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.resolve(process.cwd(), 'public/data/tournaments/2026');

const EXPECTED_ROSTERS = {
  'team-1': {
    group: 'A',
    count: 12,
    players: [
      'Vinod',
      'Ganesh',
      'Jinil',
      'Manoj',
      'Ajith TS',
      'Jithesh',
      'Lakshmi Suchith',
      'Sajith',
      'Sinoy',
      'Abishek',
      'Sam Jerry',
      'Ullas',
    ],
  },
  'team-2': {
    group: 'B',
    count: 12,
    players: [
      'Manoj',
      'Vishnu (Blue B06)',
      'Siyad',
      'Deepesh',
      'Antony David',
      'Gautham',
      'Ashim',
      'Jinosh',
      'Arun Kumar',
      'Goutham',
      'Jenson',
      'Pradeep',
    ],
  },
  'team-3': {
    group: 'A',
    count: 11,
    players: [
      'Anush',
      'Alan',
      'Vivek',
      'Akash',
      'Prasanth',
      'Dinesh',
      'Nandakumar',
      'Binu',
      'Unni',
      'Akhil George',
      'Vismaya',
    ],
  },
  'team-4': {
    group: 'B',
    count: 11,
    players: [
      'Ajmal',
      'Nibin',
      'Pramod',
      'Alex',
      'Mahipal',
      'Younus',
      'Rajesh',
      'Vinu',
      'Arul A',
      'Jayan',
      'Upendra',
    ],
  },
  'team-5': {
    group: 'A',
    count: 11,
    players: [
      'Harijith',
      'Anand John',
      'Rajiv',
      'Shafeek',
      'Ajit Mathew',
      'Balu',
      'Santosh',
      'Jibin',
      'Vicky',
      'Vishnu Krishnan',
      'Manoj',
    ],
  },
  'team-6': {
    group: 'B',
    count: 11,
    players: [
      'Denny',
      'Suchith',
      'Ajay',
      'Midhun',
      'Ajas',
      'Mansoor',
      'Vishnu 5 AM',
      'Dinoop',
      'Rajan',
      'Jeevan',
      'Bibu',
    ],
  },
};

function readJson(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing required JSON data file: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(`VALIDATION FAILED: ${message}`);
  }
}

function main() {
  const tournament = readJson('tournament.json');
  const teamsData = readJson('teams.json');
  const playersData = readJson('players.json');
  const fixturesData = readJson('fixtures.json');
  const resultsData = readJson('results.json');
  const standingsData = readJson('standings.json');
  const rulesData = readJson('rules.json');

  assert(tournament.stats.teams === 6, 'Tournament must have 6 teams');
  assert(tournament.stats.players === 68, 'Tournament must have 68 players');
  assert(tournament.stats.groups === 2, 'Tournament must have 2 groups');
  assert(tournament.stats.winningPoints === 100, 'Winning target must be 100 points');

  assert(teamsData.teams.length === 6, `Expected 6 teams, got ${teamsData.teams.length}`);
  assert(playersData.players.length === 68, `Expected 68 players, got ${playersData.players.length}`);

  // Verify unique player IDs
  const playerIds = new Set();
  for (const p of playersData.players) {
    assert(typeof p.id === 'string' && p.id.length > 0, `Invalid player ID for ${p.name}`);
    assert(!playerIds.has(p.id), `Duplicate player ID detected: ${p.id}`);
    playerIds.add(p.id);
  }

  // Verify unique team IDs & expected team structure
  const teamMap = new Map();
  for (const t of teamsData.teams) {
    assert(!teamMap.has(t.id), `Duplicate team ID: ${t.id}`);
    teamMap.set(t.id, t);
  }

  let groupACount = 0;
  let groupBCount = 0;

  for (const [teamId, expected] of Object.entries(EXPECTED_ROSTERS)) {
    const team = teamMap.get(teamId);
    assert(team, `Missing team ${teamId}`);
    assert(team.group === expected.group, `${teamId} must be in Group ${expected.group}`);
    assert(team.playerCount === expected.count, `${teamId} playerCount must be ${expected.count}`);

    const teamPlayers = playersData.players
      .filter((p) => p.teamId === teamId)
      .sort((a, b) => a.order - b.order);

    assert(
      teamPlayers.length === expected.count,
      `${teamId} expected ${expected.count} players, found ${teamPlayers.length}`
    );

    teamPlayers.forEach((p, idx) => {
      assert(
        p.name === expected.players[idx],
        `${teamId} slot #${idx + 1}: expected "${expected.players[idx]}", got "${p.name}"`
      );
      assert(
        p.group === expected.group,
        `Player ${p.name} (${p.id}) group mismatch: expected ${expected.group}, got ${p.group}`
      );
    });

    if (expected.group === 'A') groupACount += teamPlayers.length;
    if (expected.group === 'B') groupBCount += teamPlayers.length;
  }

  assert(groupACount === 34, `Group A must have 34 players, got ${groupACount}`);
  assert(groupBCount === 34, `Group B must have 34 players, got ${groupBCount}`);

  // Verify distinct duplicate/similar name records are never merged
  const manojRecords = playersData.players.filter((p) => p.name === 'Manoj');
  assert(manojRecords.length === 3, `Expected 3 distinct Manoj records, got ${manojRecords.length}`);
  const manojTeams = new Set(manojRecords.map((p) => p.teamId));
  assert(
    manojTeams.has('team-1') && manojTeams.has('team-2') && manojTeams.has('team-5'),
    'Manoj must exist distinctly in Team 1, Team 2, and Team 5'
  );

  const vishnuRecords = playersData.players.filter((p) => p.name.includes('Vishnu'));
  assert(vishnuRecords.length === 3, `Expected 3 distinct Vishnu records, got ${vishnuRecords.length}`);

  // Verify rules completeness
  assert(rulesData.officialRules.length === 10, 'Expected 10 official tournament rules');
  assert(rulesData.milestones.length === 4, 'Expected 4 milestones (25, 50, 75, 100)');

  // Verify fixtures/results/standings files are well-formed
  assert(Array.isArray(fixturesData.matches), 'fixtures.matches must be an array');
  assert(Array.isArray(resultsData.matches), 'results.matches must be an array');
  assert(standingsData.groups.A.length === 3 && standingsData.groups.B.length === 3, 'Standings groups must each contain 3 teams');

  console.log('✓ RALLY 2026 Data Validation Passed');
  console.log(`  - Teams: ${teamsData.teams.length}`);
  console.log(`  - Players: ${playersData.players.length} (Group A: ${groupACount}, Group B: ${groupBCount})`);
  console.log(`  - Distinct "Manoj" IDs: ${manojRecords.map((m) => `${m.id} (${m.teamName})`).join(', ')}`);
  console.log(`  - Distinct "Vishnu" IDs: ${vishnuRecords.map((v) => `${v.id} (${v.name} · ${v.teamName})`).join(', ')}`);
  console.log(`  - Rules: ${rulesData.officialRules.length} official rules, 4 milestones`);
}

main();

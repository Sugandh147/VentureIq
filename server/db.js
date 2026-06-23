import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = path.join(__dirname, 'db.json');

// Initialize database template
const defaultDb = {
  user: {
    subscription: 'free',
    analysisCredits: 1
  },
  startups: [],
  comments: {}, // startupId -> Array of comments
  votes: {},    // startupId -> { invest: 0, watch: 0, pass: 0, userVote: null }
  dealScenarios: [] // Array of { id, name, preMoney, roundSize, optionPool, liqPrefMultiplier, isParticipating }
};

export async function readDb() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Create DB if it doesn't exist
      await writeDb(defaultDb);
      return defaultDb;
    }
    throw error;
  }
}

export async function writeDb(data) {
  const tempPath = DB_FILE + '.tmp';
  try {
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, DB_FILE);
  } catch (error) {
    // Attempt clean up of temp file if write/rename fails
    try {
      await fs.unlink(tempPath);
    } catch {
      // Temp file cleanup failed or already deleted; ignore
    }
    throw error;
  }
}

export async function getUser() {
  const db = await readDb();
  return db.user;
}

export async function updateUser(userData) {
  const db = await readDb();
  db.user = { ...db.user, ...userData };
  await writeDb(db);
  return db.user;
}

export async function getStartups() {
  const db = await readDb();
  return db.startups;
}

export async function addStartup(startup) {
  const db = await readDb();
  // Avoid duplicates
  const index = db.startups.findIndex(s => s.id === startup.id || s.name.toLowerCase() === startup.name.toLowerCase());
  if (index !== -1) {
    db.startups[index] = { ...db.startups[index], ...startup };
  } else {
    db.startups.unshift(startup);
  }
  await writeDb(db);
  return startup;
}

export async function deleteStartup(id) {
  const db = await readDb();
  db.startups = db.startups.filter(s => s.id !== id);
  if (db.comments[id]) delete db.comments[id];
  if (db.votes[id]) delete db.votes[id];
  await writeDb(db);
}

export async function getComments(startupId) {
  const db = await readDb();
  return db.comments[startupId] || [];
}

export async function addComment(startupId, comment) {
  const db = await readDb();
  if (!db.comments[startupId]) {
    db.comments[startupId] = [];
  }
  db.comments[startupId].push(comment);
  await writeDb(db);
  return comment;
}

export async function deleteComment(startupId, commentId) {
  const db = await readDb();
  if (db.comments[startupId]) {
    db.comments[startupId] = db.comments[startupId].filter(c => c.id !== commentId);
    await writeDb(db);
  }
}

export async function getVotes(startupId) {
  const db = await readDb();
  return db.votes[startupId] || { invest: 0, watch: 0, pass: 0, userVote: null };
}

export async function castVote(startupId, voteType) {
  const db = await readDb();
  if (!db.votes[startupId]) {
    db.votes[startupId] = { invest: 0, watch: 0, pass: 0, userVote: null };
  }
  
  const currentVote = db.votes[startupId];
  
  // Undo previous vote if any
  if (currentVote.userVote) {
    currentVote[currentVote.userVote] = Math.max(0, currentVote[currentVote.userVote] - 1);
  }
  
  // Record new vote
  if (voteType) {
    currentVote[voteType] = (currentVote[voteType] || 0) + 1;
    currentVote.userVote = voteType;
  } else {
    currentVote.userVote = null;
  }
  
  // Re-calculate consensus recommendation on the startup report if it is in the database
  const startup = db.startups.find(s => s.id === startupId);
  if (startup) {
    const total = currentVote.invest + currentVote.watch + currentVote.pass;
    if (total > 0) {
      const investRatio = currentVote.invest / total;
      const passRatio = currentVote.pass / total;
      if (investRatio >= 0.5) {
        startup.recommendation = 'Strong Invest';
      } else if (investRatio >= 0.25) {
        startup.recommendation = 'Invest';
      } else if (passRatio >= 0.5) {
        startup.recommendation = 'Avoid';
      } else {
        startup.recommendation = 'Investigate Further';
      }
    }
  }

  await writeDb(db);
  return currentVote;
}

export async function getDealScenarios() {
  const db = await readDb();
  return db.dealScenarios;
}

export async function saveDealScenario(scenario) {
  const db = await readDb();
  db.dealScenarios.push(scenario);
  await writeDb(db);
  return scenario;
}

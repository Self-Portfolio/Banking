const fs = require('fs');
const path = require('path');

const DB_FILE = process.env.DB_FILE || path.join(__dirname, '..', 'data', 'db.json');

// A fresh clone has no backend/data/ directory (it holds nothing but the
// gitignored db.json, so git never tracks it) - create it up front so
// writeFileSync below doesn't fail with ENOENT.
fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });

function emptyState() {
  return { users: [], accounts: [], transactions: [], payees: [], nextId: 1 };
}

function load() {
  if (!fs.existsSync(DB_FILE)) {
    const state = emptyState();
    fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
    return state;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

let state = load();

function save() {
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2));
}

function nextId() {
  const id = state.nextId;
  state.nextId += 1;
  return id;
}

function reset(newState) {
  state = newState || emptyState();
  save();
}

module.exports = {
  get state() {
    return state;
  },
  save,
  nextId,
  reset,
  DB_FILE
};

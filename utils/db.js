import { readFileSync, writeFileSync } from 'fs';
const dbFile = 'db.json';

export const db = {
  create: (collection, data) => {
    const dbData = JSON.parse(readFileSync(dbFile, 'utf8'));
    if (!dbData[collection]) {
      dbData[collection] = [];
    }
    dbData[collection].push(data);
    writeFileSync(dbFile, JSON.stringify(dbData));
  },
  read: (collection, id) => {
    const dbData = JSON.parse(readFileSync(dbFile, 'utf8'));
    if (id) {
      return dbData[collection].find((item) => item.id === id);
    } else {
      return dbData[collection];
    }
  },
  update: (collection, id, data) => {
    const dbData = JSON.parse(readFileSync(dbFile, 'utf8'));
    const index = dbData[collection].findIndex((item) => item.id === id);
    if (index !== -1) {
      dbData[collection][index] = { ...dbData[collection][index], ...data };
      writeFileSync(dbFile, JSON.stringify(dbData));
    }
  },
  delete: (collection, id) => {
    const dbData = JSON.parse(readFileSync(dbFile, 'utf8'));
    const index = dbData[collection].findIndex((item) => item.id === id);
    if (index !== -1) {
      dbData[collection].splice(index, 1);
      writeFileSync(dbFile, JSON.stringify(dbData));
    }
  },
  findOne: (collection, query) => {
    const dbData = JSON.parse(readFileSync(dbFile, 'utf8'));
    return dbData[collection].find((item) => item.email === query.email);
  },
};
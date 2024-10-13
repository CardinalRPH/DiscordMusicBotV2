import path from "path";
import fs from "fs";
const dataFilePath = path.join(__dirname, "./guilds.json");

const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify({ guilds: {} }, null, 2));
  }
  const data = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(data);
};

const saveData = (data: any) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

export const createGuild = (guildId: string, prefix: string) => {
  const data = readData();
  data.guilds[guildId] = { prefix };
  saveData(data);
};

export const getPrefix = (guildId: string | undefined) => {
  if (!guildId) {
    return;
  }
  const data = readData();
  return data.guilds[guildId]?.prefix || null;
};

export const getAllID = () => {
  const data = readData();
  return Object.keys(data.guilds);
};

export const updatePrefix = (
  guildId: string | undefined,
  newPrefix: string
) => {
  if (!guildId) {
    return;
  }
  const data = readData();
  if (data.guilds[guildId]) {
    data.guilds[guildId].prefix = newPrefix;
    saveData(data);
  } else {
    throw new Error(`Guild ID ${guildId} Not Found.`);
  }
};

export const deleteGuild = (guildId: string | undefined) => {
  if (!guildId) {
    return;
  }
  const data = readData();
  if (data.guilds[guildId]) {
    delete data.guilds[guildId];
    saveData(data);
  } else {
    throw new Error(`Guild ID ${guildId} Not Found.`);
  }
};

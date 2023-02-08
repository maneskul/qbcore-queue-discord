import { Client, GatewayIntentBits } from "discord.js";

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

const config = require("../config.json");

bot.on("ready", () => {
  console.log(`[DISCORD-QUEUE]: Ready`);
});

const structureMember = (member: any) => {
  const { id, username, discriminator } = member.user;
  let roles: any[] = [];

  member.roles.cache.toJSON().forEach((role: any) => {
    if (role.name === "@everyone") return;
    roles.push(role.id);
  });

  return { id, username, discriminator, roles };
};

export const getUserRoles = async (user: string) => {
  const guildId = config.discord.server_id;
  const guild = await bot.guilds.fetch(guildId);
  const guildMember = await guild.members.fetch(user);
  const roles = structureMember(guildMember).roles;

  return roles;
};

bot.login(config.discord.token);

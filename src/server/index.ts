import { QueueRepository } from "../../shared/repositories/queueRepository";
import { PriorityQueue } from "./priorityQueue";
import { getUserRoles } from "../shared/discord";

const config = require("../config.json");
const priorityQueue = new PriorityQueue();

const registerToQueue = async (
  discord: string,
  source: string,
  deferrals: any
) => {
  let discordRoles = await getUserRoles(discord);
  console.log(discordRoles);

  if (config.needRole) {
    for (let i = 0; i < config.roles.length; i++) {
      let queue = config.roles[i];
      let hasRole = discordRoles.filter((d) => d == queue.roleId).length > 0;
      if (hasRole) {
        priorityQueue.insert(discord, queue.priority, source);
      }

      if (config.debug) {
        console.log(
          `[QUEUE-DISCORD] Usuario ${discord} foi encontrado na role ${queue.name} e adicionado na fila com prioridade ${queue.priority}!`
        );
      }
    }
  } else {
    deferrals.done(
      `Você não foi encontrado em nossa allowlist, caso acredite que seja um erro, entre em contato com o nosso suporte!`
    );
  }
};

const isUserInQueue = (discord: string) => {
  let found = false;
  for (let i = 0; i < priorityQueue.items.length; i++) {
    if (priorityQueue.items[i].discordId == discord) {
      found = true;
      return found;
    }
  }
};

const removeFromQueue = (discord: string) => {
  for (var i = 0; i < priorityQueue.items.length; i++) {
    if (priorityQueue.items[i].discordId == discord) {
      priorityQueue.items.splice(i, 1);
      if (config.debug) {
        console.log(`[QUEUE-DISCORD] ${discord} foi removido da fila.`);
      }
      break;
    }
  }
};

const findInQueue = (discord: string) => {
  for (var i = 0; i < priorityQueue.items.length; i++) {
    if (priorityQueue.items[i].discordId == discord) {
      return i;
    }
  }

  return 0;
};

const checkQueue = (cb: any) => {
  const maxClients = parseInt(GetConvar("sv_maxclients", "150"));
  if (GetNumPlayerIndices() < maxClients) {
    cb(true);
  } else {
    cb(false);
  }
};

on("playerConnecting", (name: string, setKickReason: any, deferrals: any) => {
  deferrals.defer();
  deferrals.update(`Olá ${name}, estamos checando seus cargos no Discord...`);

  const src = global.source.toString();
  let idFound = false;
  var discordIdentifier = "";
  for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
    const identifier = GetPlayerIdentifier(src, i);
    if (identifier.includes("discord:")) {
      discordIdentifier = identifier.slice(8);
      idFound = true;
    }
  }

  if (!idFound) {
    deferrals.done(
      `Olá ${name}, seu discord não foi encontrado! Vincule seu discord ao seu FiveM`
    );
  }

  registerToQueue(discordIdentifier, src, deferrals);
  var intervalId = setInterval(function () {
    for (let i = 0; i < GetNumPlayerIdentifiers(src); i++) {
      const identifier = GetPlayerIdentifier(src, i);
      if (identifier.includes("discord:")) {
        discordIdentifier = identifier.slice(8);
      }
    }
    if (!isUserInQueue(discordIdentifier)) {
      clearInterval(intervalId);
    }
    checkQueue((cb: any) => {
      var msg: string = "";
      if (cb == true) {
        if (priorityQueue.front().discordId == discordIdentifier) {
          deferrals.done();
          console.log(`Connecting: ${name}`);
          clearInterval(intervalId);
        } else {
          msg = `Você está na fila! [${findInQueue(discordIdentifier) + 1}/${
            priorityQueue.items.length
          }]`;
          deferrals.update(msg);
        }
      } else {
        msg = `Você está na fila! [${findInQueue(discordIdentifier) + 1}/${
          priorityQueue.items.length
        }]`;
        deferrals.update(msg);
      }
    });
  }, 500);
});

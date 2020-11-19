import { v4 as uuidv4 } from "uuid";
import { members } from "./data/organization";

export const getMembers = () =>
  new Promise((resolve, reject) => {
    if (!members) {
      return setTimeout(() => reject(new Error("Aucun membre")), 250);
    }

    setTimeout(() => resolve(Object.values(members)), 250);
  });

export const addMembers = (emails) => {
  const newMembers = emails.map((email) => {
    return {
      id: uuidv4(),
      email: email,
      role: "guest",
      status: "pending",
    };
  });
  new Promise((resolve, reject) => {
    if (!emails) {
      return setTimeout(() => reject(new Error("Aucun email envoyé")), 250);
    }
    setTimeout(() => resolve(Object.values([newMembers, ...members])), 250);
  });
};

export const detachMembers = (ids) => {
  const newMembers = emails.map((email) => {
    return {
      id: uuidv4(),
      email: email,
      role: "guest",
      status: "pending",
    };
  });
  new Promise((resolve, reject) => {
    if (!emails) {
      return setTimeout(() => reject(new Error("Aucun email envoyé")), 250);
    }
    setTimeout(() => resolve(Object.values([newMembers, ...members])), 250);
  });
};

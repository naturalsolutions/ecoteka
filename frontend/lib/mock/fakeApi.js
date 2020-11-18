import { members } from "./data/organization";

export const getMembers = () =>
  new Promise((resolve, reject) => {
    if (!members) {
      return setTimeout(() => reject(new Error("Aucun membre")), 250);
    }

    setTimeout(() => resolve(Object.values(members)), 250);
  });

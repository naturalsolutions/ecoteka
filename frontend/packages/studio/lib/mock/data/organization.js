import { v4 as uuidv4 } from "uuid";

const idOne = uuidv4();
const idTwo = uuidv4();
const idThree = uuidv4();
const idFour = uuidv4();

export let members = [
  {
    id: idOne,
    email: "admin@ecoteka.natural-solutions.eu",
    role: "owner",
    status: "member",
  },
  {
    id: idTwo,
    email: "manager@ecoteka.natural-solutions.eu",
    role: "manager",
    status: "member",
  },
  {
    id: idThree,
    email: "contributor@ecoteka.natural-solutions.eu",
    role: "contributor",
    status: "member",
  },
  {
    id: idFour,
    email: "guest@ecoteka.natural-solutions.eu",
    role: "guest",
    status: "member",
  },
];

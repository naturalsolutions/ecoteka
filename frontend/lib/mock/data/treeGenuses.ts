export interface Genus {
  canonical: string;
  family: string;
}

const genuses: Genus[] = [
  {
    canonical: "Acer",
    family: "Sapindaceae",
  },
  {
    canonical: "Fraxinus",
    family: "Oleaceae",
  },
  {
    canonical: "Quercus",
    family: "Fagaceae",
  },
  {
    canonical: "Fagus",
    family: "Fagaceae",
  },
];

export default genuses;

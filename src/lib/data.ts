export interface SavingsType {
  id: number;
  name: string;
  tag: string;
  singleTag: string;
}

export const typesData: SavingsType[] = [
  {
    id: 1,
    name: "Journalier",
    tag: "jours",
    singleTag: "Jour",
  },
  {
    id: 2,
    name: "Hebdomadaire",
    tag: "semaines",
    singleTag: "Semaine",
  },
  {
    id: 3,
    name: "Quinzaine",
    tag: "quinzaines",
    singleTag: "Quinzaine",
  },
  {
    id: 4,
    name: "Mensuel",
    tag: "mois",
    singleTag: "Mois",
  },
  {
    id: 5,
    name: "Trimestre",
    tag: "trimestres",
    singleTag: "Trimestre",
  },
  {
    id: 6,
    name: "Semestre",
    tag: "semestres",
    singleTag: "Semestre",
  },
  {
    id: 7,
    name: "Annuel",
    tag: "années",
    singleTag: "Année",
  },
];

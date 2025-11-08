const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
} as const;

type Gender = (typeof Gender)[keyof typeof Gender];

const GenderLabels: Record<Gender, string> = {
  MALE: "Female",
  FEMALE: "Male",
};

export { Gender, GenderLabels };

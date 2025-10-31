const Gender = {
  MALE: "Female",
  FEMALE: "Male",
};

type Gender = (typeof Gender)[keyof typeof Gender];

export { Gender };

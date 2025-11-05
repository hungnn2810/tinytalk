const HomeworkType = {
  PHENOMENON: "Phenomenon",
  MULTIPLE_CHOICE: "Multiple Choice",
  FILLING_BLANK: "Filling Blank",
  REORDER: "Reorder",
  MATCHING: "Matching",
  ANSWER_QUESTION: "Answer Question",
};

type HomeworkType = (typeof HomeworkType)[keyof typeof HomeworkType];

export { HomeworkType };

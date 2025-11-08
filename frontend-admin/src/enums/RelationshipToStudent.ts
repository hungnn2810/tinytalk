const RelationshipToStudent = {
  FATHER: "FATHER",
  MOTHER: "MOTHER",
} as const;

type RelationshipToStudent =
  (typeof RelationshipToStudent)[keyof typeof RelationshipToStudent];

const RelationshipToStudentLabels: Record<RelationshipToStudent, string> = {
  FATHER: "Father",
  MOTHER: "Mother",
};

export { RelationshipToStudent, RelationshipToStudentLabels };

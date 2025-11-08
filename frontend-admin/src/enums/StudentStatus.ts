const StudentStatus = {
  PENDING: "PENDING",
  INPROGRESS: "INPROGRESS",
  COMPLETED: "COMPLETED",
} as const;

type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

const StudentStatusLabels: Record<StudentStatus, string> = {
  PENDING: "Pending",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
};

export { StudentStatus, StudentStatusLabels };

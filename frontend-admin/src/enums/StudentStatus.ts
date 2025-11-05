const StudentStatus = {
  PENDING: "Pending",
  INPROGRESS: "In Progress",
  COMPLETED: "Completed",
};

type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export { StudentStatus };

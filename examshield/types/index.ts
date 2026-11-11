export type SeatStatus = "available" | "assigned" | "blocked" | "conflict";

export type Department = "CSE" | "ECE" | "ME" | "EEE" | "MBA" | "Civil" | "IT";

export type AllocationRule = {
  preventAdjacentSameSubject: boolean;
  preventAdjacentSameDepartment: boolean;
  alternateSeatAllocation: boolean;
  respectAislePositions: boolean;
  avoidBlockedSeats: boolean;
};

export type Student = {
  id: string;
  name: string;
  rollNumber: string;
  subject: string;
  department: Department;
  semester: number;
  hallId?: string;
  seatId?: string;
  examId?: string;
};

export type Hall = {
  id: string;
  name: string;
  rows: number;
  columns: number;
  aisleColumns: number[];
  blockedSeats: string[];
  capacity: number;
  department: Department;
};

export type Seat = {
  id: string;
  row: number;
  column: number;
  label: string;
  status: SeatStatus;
  occupant?: Student | null;
  blocked: boolean;
};

export type Exam = {
  id: string;
  name: string;
  subject: string;
  date: string;
  duration: number;
  studentCount: number;
  department: Department;
  semester: number;
  hallIds: string[];
  rollStart: number;
};

export type Conflict = {
  id: string;
  type: "same-subject" | "duplicate-roll" | "blocked-seat" | "missing-seat" | "capacity-overflow";
  message: string;
  seatIds: string[];
};

export type AppState = {
  exams: Exam[];
  halls: Hall[];
  students: Student[];
  currentExamId: string;
  activeHallId: string;
  allocationRules: AllocationRule;
  conflicts: Conflict[];
};

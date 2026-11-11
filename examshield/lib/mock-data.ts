import type { AppState, Department, Exam, Hall, Student } from "@/types";

const departments: Department[] = ["CSE", "ECE", "ME", "EEE", "MBA", "Civil", "IT"];
const subjects = [
  "Data Structures",
  "Operating Systems",
  "DBMS",
  "Computer Networks",
  "Microprocessors",
  "Digital Signal Processing",
  "Machine Learning",
  "Web Development",
  "Thermodynamics",
  "Control Systems",
];

const names = [
  "Aarav", "Ananya", "Rohan", "Priya", "Karthik", "Meera", "Vikram", "Ishita", "Dev", "Neha",
  "Harsh", "Sai", "Aditi", "Nikhil", "Pooja", "Samarth", "Ritika", "Tanvi", "Siddharth", "Divya",
  "Aditya", "Sonal", "Yash", "Aisha", "Rahul", "Shreya", "Varun", "Mitali", "Kunal", "Nisha",
  "Arjun", "Sneha", "Manas", "Jyoti", "Tejas", "Bhavna", "Rakesh", "Anika", "Hitesh", "Aman",
  "Prerna", "Deepak", "Rupal", "Saurav", "Anjali", "Vansh", "Manya", "Piyush", "Simran", "Kabir",
  "Esha", "Naman", "Tanya", "Sarthak", "Aastha", "Om", "Jiya", "Shivam", "Swati", "Riddhi",
  "Keshav", "Ira", "Mohit", "Zoya", "Nupur", "Yatin", "Vrinda", "Amanpreet", "Naveen", "Pranav",
  "Sheetal", "Dheeraj", "Kavya", "Parth", "Aditi", "Aman", "Bharat", "Lavanya", "Tushar", "Niyati",
  "Rishi", "Sakshi", "Abhishek", "Mira", "Nitin", "Diya", "Vivek", "Ansh", "Supriya", "Gaurav",
  "Hina", "Chirag", "Priyanshi", "Abhinav", "Rhea", "Nayan", "Sana", "Anmol", "Riya", "Kartik",
  "Mrunal", "Rudra", "Ishaan", "Gargi", "Jatin", "Akshita", "Rahim", "Mahi", "Himanshu", "Aarohi",
  "Dhruv", "Pallavi", "Soham", "Sujata", "Vinit", "Neel", "Kairavi", "Aaryan", "Kiran", "Amanat",
];

const hallTemplates: Omit<Hall, "id" | "capacity">[] = [
  { name: "Main Hall A", rows: 5, columns: 10, aisleColumns: [5], blockedSeats: ["A3", "C7", "E9"], department: "CSE" },
  { name: "Main Hall B", rows: 5, columns: 10, aisleColumns: [5], blockedSeats: ["B2", "D6", "E8"], department: "ECE" },
  { name: "Academic Block 1", rows: 4, columns: 8, aisleColumns: [4], blockedSeats: ["A5", "C1", "D8"], department: "ME" },
  { name: "Science Hall", rows: 5, columns: 9, aisleColumns: [4, 7], blockedSeats: ["B4", "D2", "E7"], department: "EEE" },
  { name: "Innovation Lab", rows: 4, columns: 10, aisleColumns: [5], blockedSeats: ["A6", "C5", "D9"], department: "IT" },
];

const hallIds = ["hall-1", "hall-2", "hall-3", "hall-4", "hall-5"];

function formatSeatLabel(rowIndex: number, columnIndex: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return `${alphabet[rowIndex]}${columnIndex + 1}`;
}

export function generateMockState(): AppState {
  const halls: Hall[] = hallTemplates.map((hall, index) => ({
    ...hall,
    id: hallIds[index],
    capacity: hall.rows * hall.columns - hall.aisleColumns.length * hall.rows,
  }));

  const students: Student[] = [];
  const examCount = 3;
  const totalStudents = 120;

  for (let index = 0; index < totalStudents; index += 1) {
    const department = departments[index % departments.length];
    const subject = subjects[index % subjects.length];
    const name = names[index % names.length];
    const semester = (index % 8) + 1;

    students.push({
      id: `student-${index + 1}`,
      name: `${name} ${index + 1}`,
      rollNumber: `20${String((index % 30) + 1).padStart(2, "0")}${String((index % 40) + 1).padStart(3, "0")}`,
      subject,
      department,
      semester,
    });
  }

  const exams: Exam[] = Array.from({ length: examCount }, (_, index) => ({
    id: `exam-${index + 1}`,
    name: index === 0 ? "Mid Sem Examination" : index === 1 ? "End Sem Examination" : "Practical Assessment",
    subject: subjects[index % subjects.length],
    date: new Date(2026, 10, 15 + index * 7).toISOString().slice(0, 10),
    duration: index === 2 ? 120 : 90,
    studentCount: 40 + index * 20,
    department: departments[index % departments.length],
    semester: (index % 6) + 3,
    hallIds: halls.slice(0, 2 + index).map((hall) => hall.id),
    rollStart: 2000 + index * 100,
  }));

  const currentExamId = exams[0].id;
  const activeHallId = halls[0].id;

  return {
    exams,
    halls,
    students,
    currentExamId,
    activeHallId,
    allocationRules: {
      preventAdjacentSameSubject: true,
      preventAdjacentSameDepartment: true,
      alternateSeatAllocation: true,
      respectAislePositions: true,
      avoidBlockedSeats: true,
    },
    conflicts: [],
  };
}

export function seatColorMap(status: string) {
  switch (status) {
    case "assigned":
      return "bg-emerald-500";
    case "available":
      return "bg-slate-100";
    case "blocked":
      return "bg-slate-300";
    case "conflict":
      return "bg-amber-400";
    default:
      return "bg-slate-100";
  }
}

export function generateSeatMap(hall: Hall) {
  const seatMap: Array<{ id: string; row: number; column: number; label: string; blocked: boolean; status: string }> = [];

  for (let row = 0; row < hall.rows; row += 1) {
    for (let column = 0; column < hall.columns; column += 1) {
      const label = formatSeatLabel(row, column);
      const isBlocked = hall.blockedSeats.includes(label) || hall.aisleColumns.includes(column);

      seatMap.push({
        id: `${hall.id}-${label}`,
        row,
        column,
        label,
        blocked: isBlocked,
        status: isBlocked ? "blocked" : "available",
      });
    }
  }

  return seatMap;
}

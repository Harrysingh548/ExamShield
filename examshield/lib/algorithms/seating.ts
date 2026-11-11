import type { AllocationRule, Conflict, Hall, Seat, Student } from "@/types";

function neighborOffsets() {
  return [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ];
}

function allowedSeat(seat: Seat, hall: Hall, rules: AllocationRule) {
  const blocked = seat.blocked || (!rules.avoidBlockedSeats && seat.blocked);
  if (blocked && rules.avoidBlockedSeats) return false;
  if (rules.respectAislePositions && hall.aisleColumns.includes(seat.column)) return false;
  return true;
}

export function buildSeatLayout(hall: Hall, rules: AllocationRule, students: Student[]) {
  const seatMap = new Map<string, Seat>();
  for (let row = 0; row < hall.rows; row += 1) {
    for (let column = 0; column < hall.columns; column += 1) {
      const label = `${String.fromCharCode(65 + row)}${column + 1}`;
      const blocked = hall.blockedSeats.includes(label) || hall.aisleColumns.includes(column);
      const id = `${hall.id}-${label}`;
      seatMap.set(id, {
        id,
        row,
        column,
        label,
        status: blocked ? "blocked" : "available",
        occupant: null,
        blocked,
      });
    }
  }

  const occupied = new Map<string, Student>();
  const sortedStudents = [...students].sort((a, b) => a.subject.localeCompare(b.subject) || a.department.localeCompare(b.department));

  for (const student of sortedStudents) {
    let placed = false;
    const seatCandidates = Array.from(seatMap.values()).filter((seat) => allowedSeat(seat, hall, rules));

    seatCandidates.sort((a, b) => {
      if (a.blocked !== b.blocked) return Number(a.blocked) - Number(b.blocked);
      return a.row * hall.columns + a.column - (b.row * hall.columns + b.column);
    });

    for (const seat of seatCandidates) {
      if (occupied.has(seat.id)) continue;
      if (rules.preventAdjacentSameSubject || rules.preventAdjacentSameDepartment) {
        let conflict = false;
        for (const [dx, dy] of neighborOffsets()) {
          const neighborRow = seat.row + dx;
          const neighborColumn = seat.column + dy;
          const nearestId = `${hall.id}-${String.fromCharCode(65 + neighborRow)}${neighborColumn + 1}`;
          const occupant = occupied.get(nearestId);
          if (!occupant) continue;
          if (rules.preventAdjacentSameSubject && occupant.subject === student.subject) {
            conflict = true;
            break;
          }
          if (rules.preventAdjacentSameDepartment && occupant.department === student.department) {
            conflict = true;
            break;
          }
        }
        if (conflict) continue;
      }

      const seatState = seatMap.get(seat.id);
      if (seatState) {
        seatState.occupant = student;
        seatState.status = "assigned";
        occupied.set(seat.id, student);
        placed = true;
      }
      break;
    }

    if (!placed && rules.alternateSeatAllocation) {
      const fallback = Array.from(seatMap.values()).filter((seat) => !occupied.has(seat.id) && !seat.blocked);
      for (const seat of fallback) {
        const seatState = seatMap.get(seat.id);
        if (!seatState) continue;
        seatState.occupant = student;
        seatState.status = "assigned";
        occupied.set(seat.id, student);
        break;
      }
    }
  }

  const conflicts: Conflict[] = [];
  const seatValues = Array.from(seatMap.values());

  for (const seat of seatValues) {
    if (seat.occupant && seat.status === "assigned") {
      for (const [dx, dy] of neighborOffsets()) {
        const neighborRow = seat.row + dx;
        const neighborColumn = seat.column + dy;
        const neighborId = `${hall.id}-${String.fromCharCode(65 + neighborRow)}${neighborColumn + 1}`;
        const neighborSeat = seatMap.get(neighborId);
        if (!neighborSeat || !neighborSeat.occupant) continue;
        if (rules.preventAdjacentSameSubject && neighborSeat.occupant.subject === seat.occupant.subject) {
          conflicts.push({
            id: `conflict-${seat.id}-${neighborSeat.id}`,
            type: "same-subject",
            message: `${seat.occupant.name} and ${neighborSeat.occupant.name} share ${seat.occupant.subject}.`,
            seatIds: [seat.id, neighborSeat.id],
          });
        }
        if (rules.preventAdjacentSameDepartment && neighborSeat.occupant.department === seat.occupant.department) {
          conflicts.push({
            id: `conflict-dept-${seat.id}-${neighborSeat.id}`,
            type: "same-subject",
            message: `${seat.occupant.name} and ${neighborSeat.occupant.name} sit in same department adjacency.`,
            seatIds: [seat.id, neighborSeat.id],
          });
        }
      }
    }
  }

  const assigned = Array.from(seatMap.values()).filter((seat) => seat.occupant).length;
  if (assigned > hall.capacity) {
    conflicts.push({
      id: `capacity-${hall.id}`,
      type: "capacity-overflow",
      message: `Capacity overflow in ${hall.name}.`,
      seatIds: Array.from(seatMap.keys()),
    });
  }

  return { seatMap: Array.from(seatMap.values()), conflicts };
}

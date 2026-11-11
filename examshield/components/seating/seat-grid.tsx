"use client";

import { Minus, Plus } from "lucide-react";
import { useMemo, useState } from "react";

export function SeatGrid({
  hall,
  seats,
  onSeatClick,
  selectedSeatId,
  onMoveStudent,
}: {
  hall: { id: string; name: string; rows: number; columns: number; aisleColumns: number[]; blockedSeats: string[] };
  seats: Array<{ id: string; row: number; column: number; label: string; status: string; blocked: boolean; occupant?: { id: string; name: string; rollNumber: string; subject: string } | null }>;
  onSeatClick: (seatId: string) => void;
  selectedSeatId?: string;
  onMoveStudent: (studentId: string, seatId: string) => void;
}) {
  const [zoom, setZoom] = useState(1);

  const seatStyle = useMemo(
    () => ({
      width: `${78 * zoom}px`,
      height: `${78 * zoom}px`,
    }),
    [zoom],
  );

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, seatId: string) => {
    event.preventDefault();
    const studentId = event.dataTransfer.getData("studentId");
    if (studentId) onMoveStudent(studentId, seatId);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Interactive map</p>
          <h3 className="text-xl font-semibold text-slate-900">{hall.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((current) => Math.max(0.8, Number((current - 0.1).toFixed(1))))}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium text-slate-700">{zoom.toFixed(1)}x</span>
          <button
            type="button"
            onClick={() => setZoom((current) => Math.min(1.5, Number((current + 0.1).toFixed(1))))}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="space-y-2">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${hall.columns}, minmax(0, 1fr))`, gap: 8 }}>
            {Array.from({ length: hall.columns }, (_, index) => (
              <div key={`top-${index}`} className="text-center text-xs font-semibold text-slate-500">{index + 1}</div>
            ))}
          </div>

          {Array.from({ length: hall.rows }, (_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="grid" style={{ gridTemplateColumns: `repeat(${hall.columns}, minmax(0, 1fr))`, gap: 8 }}>
              {Array.from({ length: hall.columns }, (_, columnIndex) => {
                const seat = seats.find((item) => item.row === rowIndex && item.column === columnIndex);
                if (!seat) return null;
                const isSelected = selectedSeatId === seat.id;
                const seatColor =
                  seat.status === "assigned"
                    ? "bg-emerald-500 text-white"
                    : seat.status === "blocked"
                      ? "bg-slate-300 text-slate-700"
                      : seat.status === "conflict"
                        ? "bg-amber-400 text-slate-900"
                        : "bg-slate-100 text-slate-600";

                return (
                  <div
                    key={seat.id}
                    draggable={Boolean(seat.occupant)}
                    onDragStart={(event) => {
                      if (seat.occupant) event.dataTransfer.setData("studentId", seat.occupant.id);
                    }}
                    onDrop={(event) => handleDrop(event, seat.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onClick={() => onSeatClick(seat.id)}
                    className={`flex cursor-pointer items-center justify-center rounded-xl border text-[10px] font-semibold shadow-sm transition hover:scale-[1.02] ${seatColor} ${
                      isSelected ? "ring-2 ring-blue-400 ring-offset-2" : "border-slate-200"
                    }`}
                    style={seatStyle}
                    title={seat.label}
                  >
                    {seat.occupant ? seat.occupant.rollNumber : seat.label}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

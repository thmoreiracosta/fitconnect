import React from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Dumbbell } from "lucide-react";

export default function WorkoutCalendar({ workouts }) {
  const today = new Date();
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const hasWorkout = (date) => {
    return workouts.some(w => isSameDay(new Date(w.date), date));
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-4 space-y-4">
      <h2 className="text-xl font-semibold gradient-text">Calendário de Treinos</h2>
      <div className="grid grid-cols-7 gap-2 text-sm text-center">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map(d => (
          <div key={d} className="font-semibold text-gray-500">{d}</div>
        ))}
        {daysInMonth.map((day) => {
          const workout = hasWorkout(day);
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`rounded-lg p-2 h-16 flex flex-col items-center justify-center border
                ${isCurrentDay ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                ${workout ? "bg-emerald-100 text-emerald-800 font-medium" : ""}
              `}
            >
              <span>{format(day, "d", { locale: ptBR })}</span>
              {workout && <Dumbbell className="w-4 h-4 mt-1" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

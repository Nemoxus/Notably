import React, { useState, useEffect } from "react";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const daysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const generateCalendarDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDay();
    const daysInCurrentMonth = daysInMonth(month + 1, year);
    const prevMonthDays = daysInMonth(month, year);

    let days = [];
    for (let i = firstDay; i > 0; i--) {
      days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
    }
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }
    for (let i = 1; days.length < 42; i++) {
      days.push({ day: i, isCurrentMonth: false });
    }

    setCalendarDays(days);
  };

  const navigateToPreviousMonth = () => {
    const prevDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(prevDate);
    generateCalendarDays(prevDate);
  };

  const navigateToNextMonth = () => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(nextDate);
    generateCalendarDays(nextDate);
  };

  const navigateToCurrentMonth = () => {
    const today = new Date();
    setCurrentDate(today);
    generateCalendarDays(today);
  };

  useEffect(() => {
    generateCalendarDays(currentDate);
  }, [currentDate]);

  return (
    <div className="calendar">
      <div className="calendar-inner">
        <div className="calendar-controls">
          <div className="calendar-prev" onClick={navigateToPreviousMonth}>
            &lt;
          </div>
          <div className="calendar-year-month">
            <div className="calendar-month-label">
              {months[currentDate.getMonth()]}
            </div>
            <div>-</div>
            <div className="calendar-year-label">
              {currentDate.getFullYear()}
            </div>
          </div>
          <div className="calendar-next" onClick={navigateToNextMonth}>
            &gt;
          </div>
        </div>
        <div
          className="calendar-today-date"
          onClick={navigateToCurrentMonth}
        >{`Today: ${weekdays[currentDate.getDay()]}, ${currentDate.getDate()}, ${
          months[currentDate.getMonth()]
        } ${currentDate.getFullYear()}`}</div>
        <div className="calendar-body">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
          {calendarDays.map((item, index) => (
            <div
              key={index}
              className={`number-item ${
                item.isCurrentMonth ? "" : "other-month"
              } ${
                item.isCurrentMonth &&
                item.day === currentDate.getDate() &&
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
                  ? "calendar-today"
                  : ""
              }`}
            >
              {item.day}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;

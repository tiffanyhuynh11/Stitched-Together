import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

const BirthdayCalendar = ({ profiles }) => {
    const [value, setValue] = useState(new Date());
    const [view, setView] = useState("month");

    const getBirthdaysForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return profiles.filter((p) => p.birthday === dateStr);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const bdays = getBirthdaysForDate(date);
            return bdays.length > 0 ? (
                <div className="text-xs text-pink-500 mt-1">
                    🎉 {bdays.map((p) => p.name).join(', ')}
                </div>
            ) : null;
        }
    };

    return (
        <div className="w-full max-w-screen-md mx-auto py-8 px-4 text-center">
            <h1 className="text-4xl font-extrabold mb-6 text-peach-500">
                Birthday Calendar
            </h1>

            <div className="flex justify-center">
                <Calendar
                    onChange={setValue}
                    value={value}
                    tileContent={tileContent}
                    calendarType="gregory"
                    view={view}
                    maxDetail="year"
                    onClickMonth={() => setView("month")}
                    onClickYear={() => setView("month")}
                    onActiveStartDateChange={({ view: newView }) => {
                        if (newView === "decade") {
                          setView("year");
                        } else {
                          setView(newView);
                        }
                      }}
                />
            </div>
        </div>
    );
};

export default BirthdayCalendar;

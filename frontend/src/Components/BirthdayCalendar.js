import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './Calendar.css';

const BirthdayCalendar = ({ user = {}, profiles = [] }) => {
    const [value, setValue] = useState(new Date());
    const [view, setView] = useState("month");

    const getBirthdaysForDate = (date) => {
        console.log("User birthday:", user?.birthday);
        console.log("Friend birthdays:", (profiles || []).map(p => p.birthday));

        const monthDay = date.toISOString().slice(5, 10);
        if (!user) return [];

        return [user, ...(profiles || [])].filter((p) => {
            if (!p.birthday) return false;
            const bdayMonthDay = new Date(p.birthday).toISOString().slice(5, 10);
            return bdayMonthDay === monthDay;
        });
    };


    const tileContent = ({ date, view }) => {
        const bdays = getBirthdaysForDate(date);
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

import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';
import './Calendar.css';

const BirthdayCalendar = ({ user = {}, profiles = [] }) => {
    const [value, setValue] = useState(new Date());
    const [view, setView] = useState("month");

    // getting the birthdays of each profile
    const getBirthdaysForDate = (date) => {
        const monthDay = date.toISOString().slice(5, 10); //will ignore year
        if (!user) return [];

        return [user, ...(profiles || [])].filter((p) => {
            if (!p.birthday) return false;
            const bdayMonthDay = new Date(p.birthday).toISOString().slice(5, 10); // will ignore the year
            return bdayMonthDay === monthDay;
        });
    };

    // the individual days in the calendar
    const tileContent = ({ date, view }) => {
        if (view !== 'month') return null;
      
        const bdays = getBirthdaysForDate(date);
        if (bdays.length === 0) return null;
      
        return (
          <div className="birthday-wrapper">
            <div className="birthday-list">
              {bdays.map((p) => (
                <Link to={`/friend/${p.id}`} key={p.id} className="birthday-link">
                  🎉 {p.name}
                </Link>
              ))}
            </div>
          </div>
        );
      };      

    return (
        <div className="w-full max-w-screen-md mx-auto py-8 px-4 text-center">
            <h1 className="text-4xl font-extrabold mb-6 text-peach-500">
                Birthday Calendar
            </h1>

            <div className="flex justify-center">
                {/* from react-calendar*/}
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

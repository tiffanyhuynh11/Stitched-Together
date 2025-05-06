import React, { useEffect, useState } from 'react';
import BirthdayCalendar from '../Components/BirthdayCalendar';

const CalendarPage = () => {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetch("/my-stitches")
      .then((res) => res.json())
      .then((data) => setProfiles(data))
      .catch((err) => console.error("Failed to fetch profiles", err));
  }, []);

  return <BirthdayCalendar profiles={profiles} />;
};

export default CalendarPage;

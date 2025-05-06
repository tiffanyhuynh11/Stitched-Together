import React, { useEffect, useState } from 'react';
import BirthdayCalendar from '../Components/BirthdayCalendar';

const CalendarPage = ({ user = {}, profiles = [] }) => {
  return <BirthdayCalendar user={user} profiles={profiles} />;
};

export default CalendarPage;

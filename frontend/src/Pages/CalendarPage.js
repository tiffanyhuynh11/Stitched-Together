import React, { useEffect, useState } from 'react';
import BirthdayCalendar from '../Components/BirthdayCalendar';

const CalendarPage = () => {
  const [user, setUser] = useState(null)  // for the user profile
  const [profiles, setProfiles] = useState([])    // for the friend profiles

  // fetch User data from the backend
  useEffect(() => {
    fetch("/profile").then(
      response => response.json()
    ).then(data => {
        setUser(data);
        console.log(data);
      })
      .catch(error => console.error("Error fetching profile:", error));
  }, []);


  // fetch Friend data from the backend
  useEffect(() => {
    fetch("/my-stitches").then(
      response => response.json()
    ).then(
      data => {
        setProfiles(data)
        console.log(data)
      }
    ).catch(error => console.error("Error fetching profiles:", error));
  }, [])

  return <BirthdayCalendar user={user} profiles={profiles} />;
};

export default CalendarPage;

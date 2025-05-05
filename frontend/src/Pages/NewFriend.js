import React from "react";
import Profile from "../Components/Profile"

function NewFriend() {
  const defaultData = {
    name: 'New Friend',
    birthday: '',
    relationship: '',
    so: '',
    gifts: '',
    notes: '',
  };
  return (
    <div>
      <Profile data={defaultData} add={true} />
    </div>
  );

};

export default NewFriend;

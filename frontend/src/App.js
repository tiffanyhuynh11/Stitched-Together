import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserProfilePage from './Pages/UserProfile';
import FriendProfilePage from './Pages/FriendProfile';
import HomePage from './Pages/HomePage';
import Navbar from './Components/Navbar';
import Stitches from './Pages/Stitches';
import NewFriendPage from './Pages/NewFriend';
import CalendarPage from './Pages/CalendarPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/friend/:friendId" element={<FriendProfilePage />} />
            <Route path="/my-stitches" element={<Stitches />} />
            <Route path="/new-friend" element={<NewFriendPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App;


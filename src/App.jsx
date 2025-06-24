import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Onboarding from "./pages/Onboarding";
import WorkoutPlans from "./pages/WorkoutPlans";
import RegisterTrainer from "./pages/RegisterTrainer";
import Profile from "./pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<WorkoutPlans />} />
        <Route path="/register-trainer" element={<RegisterTrainer />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
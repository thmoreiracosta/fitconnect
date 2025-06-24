import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Onboarding";
import WorkoutPlans from "./pages/WorkoutPlans";
import RegisterTrainer from "./pages/RegisterTrainer";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<WorkoutPlans />} />
        <Route path="/register-trainer" element={<RegisterTrainer />} />
      </Routes>
    </Router>
  );
}

export default App;

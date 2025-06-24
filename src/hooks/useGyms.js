import { useState, useEffect } from "react";
import Gym from "../api/Gym";

export function useGyms(filter = {}) {
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Gym.list(filter)
      .then(setGyms)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [JSON.stringify(filter)]);

  return { gyms, loading, error };
}
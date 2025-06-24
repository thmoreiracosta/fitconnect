import { useState, useEffect } from "react";
import User from "../api/User";

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    User.me()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}
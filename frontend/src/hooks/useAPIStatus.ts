import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useAPIStatus() {
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/")
      .then((res) => setStatus(res.data.message))
      .catch((err) => setError(err.message));
  }, []);

  return { status, error };
}

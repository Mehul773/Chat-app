import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  const [ws, setWs] = useState(null);


  useEffect(() => {
    if (!user) {
      axios.get("/getUserDetails").then(({ data }) => {
        setUser(data);
        setReady(true);
      });
    }
  }, []);
   // Reload whenever the user data changes
  return (
    <UserContext.Provider value={{ user, setUser, ready ,ws, setWs }}>
      {children}
    </UserContext.Provider>
  );
}

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/user";

export const useAuthStatus = () => {
  const [loggedIn, setloggedIn] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true); //Loading
  const dispatch = useDispatch();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setloggedIn(true);
      }
      setCheckingStatus(false);
    });

    return unsub;
  }, []);

  return { loggedIn, checkingStatus };
};

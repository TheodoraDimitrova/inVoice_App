import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { useAuthStatus } from "../../../hooks/useAuthStatus";
import { logOut } from "../../../redux/user";
import { showToast } from "../../../utils/functions";

export const useHomeNav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loggedIn } = useAuthStatus();

  const onSignOut = async () => {
    try {
      await signOut(getAuth());
      dispatch(logOut());
      showToast("success", "Довиждане!👋");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return { loggedIn, onSignOut };
};

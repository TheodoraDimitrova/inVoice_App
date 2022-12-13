import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Loading from "../components/Loading";

const PublicRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus();

  if (checkingStatus) {
    return <Loading />;
  }

  return !loggedIn ? <Outlet /> : <Navigate to="/profile" />;
};

export default PublicRoute;

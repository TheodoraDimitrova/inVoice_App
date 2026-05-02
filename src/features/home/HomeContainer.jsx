import React from "react";
import { useHomeNav } from "./hooks/useHomeNav";
import HomePage from "./HomePage";

const HomeContainer = () => {
  const { loggedIn, onSignOut } = useHomeNav();
  return <HomePage loggedIn={loggedIn} onSignOut={onSignOut} />;
};

export default HomeContainer;

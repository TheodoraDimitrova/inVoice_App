import React from "react";

const Footer = () => {
  return (
    <footer className="min-h-[10vh] w-full p-8 flex items-center justify-center">
      <p className="text-sm">
        TBD All Rights Reserved <span>&copy;</span> {new Date().getFullYear()}
        {/* <a href="" rel="noopener noreferrer" target="_blank"></a> */}
      </p>
    </footer>
  );
};

export default Footer;

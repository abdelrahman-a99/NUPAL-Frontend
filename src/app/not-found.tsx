"use client";

import { useEffect } from "react";

const NotFound = () => {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div>
      <h1>NotFound page</h1>
    </div>
  );
}

export default NotFound;

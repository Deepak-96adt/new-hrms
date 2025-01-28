import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const useInactivityLogout = (timeout = 900000) => {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(logout, timeout);
  };

  const logout = () => {
    window.location.reload();
    navigate("/login"); 
  };

  useEffect(() => {
    const handleActivity = () => resetTimer();
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    window.addEventListener("scroll", handleActivity);
    resetTimer(); 

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      clearTimeout(timerRef.current);
    };
  }, []);

  return null;
};

export default useInactivityLogout;

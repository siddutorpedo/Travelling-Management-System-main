import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import Spinner from "../components/Spinner";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await fetch("/api/user/admin-auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.check) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);
      } finally {
        setChecking(false);
      }
    };

    if (currentUser && currentUser.user_role === 1) {
      authCheck();
    } else {
      setOk(false);
      setChecking(false);
    }
  }, [currentUser]);

  if (checking) return <Spinner />;

  return ok ? <Outlet /> : <Navigate to="/login" />;
}

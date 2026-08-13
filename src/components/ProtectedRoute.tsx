import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({
  children,
}: ProtectedRouteProps) {

  const authenticated =
    localStorage.getItem(
      "lexai_authenticated"
    ) === "true";


  if (!authenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  return <>{children}</>;
}

export default ProtectedRoute;
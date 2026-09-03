import { Navigate, useLocation } from 'react-router-dom';
import { getToken } from '../../lib/api';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = getToken();


  //this checks whetehr a token exists in localstorage
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

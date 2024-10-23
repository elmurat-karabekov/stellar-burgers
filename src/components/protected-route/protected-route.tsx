import { FC } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '../ui';
import { useSelector } from '../../services/store';
import { isAuthChecked, selectUser } from '../../services/slices/userAuthSlice';
// import { isAuthChecked, selectUser } from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  unAuthedOnly?: boolean;
  children?: React.ReactNode;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  unAuthedOnly = false,
  children
}) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const isUserAuthChecked = useSelector(isAuthChecked);

  if (!isUserAuthChecked) {
    return <Preloader />;
  }

  if (!unAuthedOnly && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (unAuthedOnly && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

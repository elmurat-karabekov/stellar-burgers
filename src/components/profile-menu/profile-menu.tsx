import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { Preloader, ProfileMenuUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { isAuthLoading, logout } from '../../services/slices/userAuthSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();

  const dispatch = useDispatch();

  const handleLogout = () => dispatch(logout());

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

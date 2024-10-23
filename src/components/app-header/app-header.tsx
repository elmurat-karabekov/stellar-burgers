import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUser } from '../../services/slices/userAuthSlice';

export const AppHeader: FC = () => {
  const userName = useSelector(selectUser)?.name;

  return <AppHeaderUI userName={userName} />;
};

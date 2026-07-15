import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '@store';
import { userDataSelector } from '@selectors';

export const AppHeader: FC = () => {
  const user = useSelector(userDataSelector);

  return <AppHeaderUI userName={user?.name} />;
};

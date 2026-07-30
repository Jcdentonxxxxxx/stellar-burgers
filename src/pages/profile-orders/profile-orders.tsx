import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch } from '@store';
import { fetchOrdersByUser } from '@slices';
import { useSelector } from '@store';

import { getOrdersByUser, getOrdersGettingStatus } from '@selectors';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchOrdersByUser());
  }, [dispatch]);

  const orders: TOrder[] = useSelector(getOrdersByUser);
  const ordersIsGetting = useSelector(getOrdersGettingStatus);

  if (ordersIsGetting) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};

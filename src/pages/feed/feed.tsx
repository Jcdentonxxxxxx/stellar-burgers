import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useEffect } from 'react';

import { useDispatch } from '@store';
import { fetchFeedsOrders } from '@slices';
import { useSelector } from '@store';

import { getFeedsOrders, getFeedsLoadingStatus } from '@selectors';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(getFeedsOrders);
  const isLoadingFeeds: boolean = useSelector(getFeedsLoadingStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFeedsOrders());
  }, [dispatch]);

  if (!orders.length && isLoadingFeeds) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(fetchFeedsOrders());
      }}
    />
  );
};

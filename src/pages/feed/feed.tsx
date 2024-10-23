import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  isFeedLoading,
  loadFeed,
  selectFeedOrders
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const isLoading = useSelector(isFeedLoading);

  const orders: TOrder[] = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(loadFeed());
  }, [dispatch]);

  if (!orders.length) {
    return null;
  }

  return isLoading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(loadFeed())} />
  );
};

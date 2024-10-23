import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  resetConstructor,
  selectBurgerConstructor
} from '../../services/slices/burgerConstructorSlice';
import { selectUser } from '../../services/slices/userAuthSlice';
import { useNavigate } from 'react-router-dom';
import {
  isOrderRequested,
  orderBurger,
  resetOrderModal,
  selectOrderModal
} from '../../services/slices/ordersSlice';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectBurgerConstructor);
  const user = useSelector(selectUser);

  const orderRequest = useSelector(isOrderRequested);

  const orderModalData = useSelector(selectOrderModal);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      return navigate('/login');
    }

    const orderIngredientIDs = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(orderBurger(orderIngredientIDs))
      .unwrap()
      .then(() => dispatch(resetConstructor()))
      .catch((err) => console.log(err));
  };

  const closeOrderModal = () => dispatch(resetOrderModal());

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

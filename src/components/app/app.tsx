import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  ProtectedRoute,
  OrderInfo,
  IngredientDetails,
  Modal
} from '@components';

import { useDispatch } from '../../services/store';
import { fetchIngredients } from '@slices';

const App = () => {
  const location = useLocation();
  const background = location.state?.background;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route element={<ProtectedRoute onlyUnAuth />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute onlyAuth />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/profile/orders' element={<ProfileOrders />} />
          <Route path='/profile/orders/:number' element={<OrderInfo />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Route>

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          {/* <Route
            path='/profile/orders/:number'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <ProtectedRoute onlyAuth>
                  <OrderInfo />
                </ProtectedRoute>
              </Modal>
            }
          /> */}
        </Routes>
      )}
    </div>
  );
};

export default App;

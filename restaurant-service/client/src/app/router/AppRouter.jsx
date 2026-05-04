import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../../features/auth/pages/LoginPage.jsx';
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage.jsx';
import { RestaurantPage } from '../../features/restaurants/pages/RestaurantPage.jsx';
import { MenuPage } from '../../features/menu/pages/MenuPage.jsx';
import { OrdersPage } from '../../features/orders/pages/OrdersPage.jsx';
import { ReservationsPage } from '../../features/reservations/pages/ReservationsPage.jsx';
import { PaymentsPage } from '../../features/payments/pages/PaymentsPage.jsx';
import { ReportsPage } from '../../features/reports/pages/ReportsPage.jsx';
import { RequireAuth } from './RequireAuth.jsx';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/restaurants"
          element={
            <RequireAuth>
              <RestaurantPage />
            </RequireAuth>
          }
        />
        <Route
          path="/menu"
          element={
            <RequireAuth>
              <MenuPage />
            </RequireAuth>
          }
        />
        <Route
          path="/orders"
          element={
            <RequireAuth>
              <OrdersPage />
            </RequireAuth>
          }
        />
        <Route
          path="/reservations"
          element={
            <RequireAuth>
              <ReservationsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/payments"
          element={
            <RequireAuth>
              <PaymentsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/reports"
          element={
            <RequireAuth>
              <ReportsPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

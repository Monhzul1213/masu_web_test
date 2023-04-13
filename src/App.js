import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { Layout } from 'antd';
import { SizeMe } from 'react-sizeme';
import { useSelector, useDispatch } from 'react-redux';
import { createBrowserHistory } from "history";

import { setIsLoggedIn } from './services';
import { Header, Menu } from './components/menu';
import { Loading, Login, SignUp, Confirm, Home, Config, Recovery } from './pages';
import { Category, Inventory, InventoryAdd, InventoryImport, Modifier, ModifierAdd } from './pages/invt';
import { Employee, EmployeeAdd, Merchant, Role, RoleAdd, Time } from './pages/emp';
import { Receipt, ReportItem, Review } from './pages/report';
import { Order, OrderAdd, OrderVendors, OrderScreen } from './pages/management';
import { Invoice, InvoiceAdd, Solve, SolveAdd } from './pages/system';
import { Customer, Discount, DiscountAdd, TimeList, Suppliers, SupplierAdd } from './src1/pages';
import { SalesEmployee, SalesCategory, SalesPayment, SalesModifier, DiscountRP, Taxes } from './src1/pages/report';
import { Info, Advert, AdvertAdd, NotiAdd, Notification } from './src1/pages/system';
import { PartnerLogin, PartnerSignUp } from './pages/partner';

export function App(){
  const [collapsed, setCollapsed] = useState(false);
  const loggedIn = useSelector(state => state.temp.loggedIn);
  const user = useSelector(state => state.login.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!window.sessionStorage.length){
      window.localStorage.setItem('getSessionStorage', Date.now());
    } else {
      dispatch(setIsLoggedIn(true));
    }
    window.addEventListener('storage', function(event){
      if(event.key === 'getSessionStorage') {
        window.localStorage.setItem('sessionStorage', Date.now());
        window.localStorage.removeItem('sessionStorage');
      } else if(event.key === 'sessionStorage' && !window.sessionStorage.length){
        window.sessionStorage.setItem('CREDENTIALS_TOKEN', Date.now());
        dispatch(setIsLoggedIn(true));
      } else if(event.key === 'CREDENTIALS_FLUSH'){
        dispatch(setIsLoggedIn(false));
        window.sessionStorage.removeItem('CREDENTIALS_TOKEN');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if(!loggedIn || !user) return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path='*' element={<Login />} />
          <Route path='/sign_up' element={<SignUp />} />
          <Route path='/confirm' element={<Confirm />} />
          <Route path='/recovery' element={<Recovery />} />
          <Route path='/partner_sign_up' element={<PartnerSignUp />} />
          <Route path='/partner_sign_in' element={<PartnerLogin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );

  const menuProps = { collapsed, setCollapsed };
  
  return (
    <HistoryRouter history={createBrowserHistory()}>
      <Suspense fallback={<Loading />}>
        <Layout style={{minHeight: '100vh'}}>
          <Header {...menuProps} />
          <SizeMe>{({ size }) => 
          <Layout>
            <Menu {...menuProps} size={size} />
            <Layout>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='*' element={<Home />} />
                <Route path='/confirm' element={<Confirm />} />
                <Route path='/config/*' element={<Config size={size} collapsed={collapsed} />} />
                <Route path='/inventory/invt_category' element={<Category />} />
                <Route path='/inventory/invt_list' element={<Inventory />} />
                <Route path='/inventory/invt_list/invt_add' element={<InventoryAdd />} />
                <Route path='/inventory/invt_list/invt_import' element={<InventoryImport />} />
                <Route path='/inventory/invt_modi' element={<Modifier />} />
                <Route path='/inventory/invt_modi/modi_add' element={<ModifierAdd />} />
                <Route path='/employee/emp_list' element={<Employee />} />
                <Route path='/employee/emp_list/emp_add' element={<EmployeeAdd />} />
                <Route path='/inventory/invt_discount' element={<Discount />} />
                <Route path='/inventory/invt_discount/disc_add' element={<DiscountAdd />} />
                <Route path='/customer' element={<Customer />} />
                <Route path='/employee/access_config' element={<Role />} />
                <Route path='/employee/access_config/access_add' element={<RoleAdd />} />
                <Route path='/employee/shift_config' element={<Time />} />
                <Route path='/employee/shift_list' element={<TimeList />} />
                <Route path='/management/suppliers' element={<Suppliers />} />
                <Route path='/management/suppliers/supp_add' element={<SupplierAdd/>} />
                <Route path='/management/order_list' element={<Order />} />
                <Route path='/management/order_list/order_add' element={<OrderAdd />} />
                <Route path='/management/order_list/order_vendors' element={<OrderVendors />} />
                <Route path='/management/order_list/order' element={<OrderScreen />} />
                <Route path='/report/report_document' element={<Receipt />} />
                <Route path='/report/report_employee' element={<SalesEmployee />} />
                <Route path='/report/report_category' element={<SalesCategory />} />
                <Route path='/report/report_payment' element={<SalesPayment />} />
                <Route path='/report/report_edited' element={<SalesModifier />} />
                <Route path='/report/report_discount' element={<DiscountRP />} />
                <Route path='/report/report_sales' element={<Review />} />
                <Route path='/system/request_solve' element={<Solve />} />
                <Route path='/system/request_solve/solve_add' element={<SolveAdd />} />
                <Route path='/report/report_noat' element={<Taxes />} />
                <Route path='/profile' element={<Merchant />} />
                <Route path='/report/report_invtentory' element={<ReportItem />} />
                <Route path='/system/invoice' element={<Invoice />} />
                <Route path='/system/invoice/invoice_add' element={<InvoiceAdd />} />
                <Route path='/system/info' element={<Info />} />
                <Route path='/system/advert' element={<Advert />} />
                <Route path='/system/advert/advert_add' element={<AdvertAdd />} />
                <Route path='/system/notification' element={<Notification />} />
                <Route path='/system/notification/noti_add' element={<NotiAdd />} />
              </Routes>
            </Layout>
          </Layout>
          }</SizeMe>
        </Layout>
      </Suspense>
    </HistoryRouter>
  )
}
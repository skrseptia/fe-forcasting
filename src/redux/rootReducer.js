import { all } from "redux-saga/effects";
import { combineReducers } from "redux";
import usersReducer from "../app/pages/users/usersSlice";
import productsReducer from "../app/pages/products/productsSlice";
import ordersReducer from "../app/pages/orders/transactionSlice";
import storesReducer from "../app/pages/stores/storesSlice";
import dashboardSlice from "../app/pages/dashboard/dashboardSlice";
import transactionReducer from "../app/pages/transaction/transactionSlice";
import categoriesReducer from "../app/pages/categories/categoriesSlice";
import uomReducer from "../app/pages/uom/uomSlice";
import dashboardReducer from "../app/pages/dashboard/dashboardSlice";
import metodelogiReducer from "../app/pages/metodologi/metologiSlice";

import * as auth from "../app/modules/Auth/_redux/authRedux";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  users: usersReducer,
  products: productsReducer,
  orders: ordersReducer,
  transaction: transactionReducer,
  stores: storesReducer,
  uom: uomReducer,
  categories: categoriesReducer,
  dashboard: dashboardReducer,
  metodelogi: metodelogiReducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}

import { all } from "redux-saga/effects";
import { combineReducers } from "redux";
import usersReducer from "../app/pages/users/usersSlice";
import productsReducer from "../app/pages/products/productsSlice";
import ordersReducer from "../app/pages/orders/ordersSlice";
import merchantsReducer from "../app/pages/merchants/merchantsSlice";
import storesReducer from "../app/pages/stores/storesSlice";

import * as auth from "../app/modules/Auth/_redux/authRedux";

export const rootReducer = combineReducers({
  auth: auth.reducer,
  users: usersReducer,
  products: productsReducer,
  orders: ordersReducer,
  merchants: merchantsReducer,
  stores: storesReducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
}

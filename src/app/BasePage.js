import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/users/UsersPage";
import { UsersCreate } from "./pages/users/UsersCreate";
import { ProductPage } from "./pages/products/ProductsPage";
import { OrdersPage } from "./pages/orders/OrdersPage";
import { UsersEdit } from "./pages/users/UsersEdit";

const UserProfilepage = lazy(() =>
  import("./modules/UserProfile/UserProfilePage")
);

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect

  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
        }
        <ContentRoute path="/dashboard" component={DashboardPage} />
        <ContentRoute path="/builder" component={BuilderPage} />
        <ContentRoute path="/my-page" component={MyPage} />

        {/* users */}
        <ContentRoute path="/users/edit/:id" component={UsersEdit} />
        <ContentRoute path="/users/create" component={UsersCreate} />
        <ContentRoute path="/users" component={UsersPage} />

        {/* users */}
        {/* <ContentRoute path="/users/create" component={UsersCreate} /> */}
        <ContentRoute path="/products" component={ProductPage} />

        {/* orders */}
        {/* <ContentRoute path="/users/create" component={UsersCreate} /> */}
        <ContentRoute path="/orders" component={OrdersPage} />

        <Route path="/user-profile" component={UserProfilepage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}

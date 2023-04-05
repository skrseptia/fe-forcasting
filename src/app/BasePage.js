import React, { Suspense, lazy } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../_metronic/layout";
import { BuilderPage } from "./pages/BuilderPage";
import { MyPage } from "./pages/MyPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { UsersPage } from "./pages/users/UsersPage";
import { UsersCreate } from "./pages/users/UsersCreate";
import { ProductPage } from "./pages/products/ProductsPage";
import { TransactionPage } from "./pages/orders/TransactionPage";
import { UsersEdit } from "./pages/users/UsersEdit";
import { MerchansPage } from "./pages/merchants/MerchantsPage";
import { MerchantsCreate } from "./pages/merchants/MerchantsCreate";
import { MerchantsEdit } from "./pages/merchants/MerchatsEdit";
import { CategoriesPage } from "./pages/categories/CategoriesPage";
import { CategoriesCreate } from "./pages/categories/CategoriesCreate";
import { CategoriesEdit } from "./pages/categories/CategoriesEdit";
import { StoresEdit } from "./pages/stores/StoresEdit";
import { StoresCreate } from "./pages/stores/StoresCreate";
import { StoresPage } from "./pages/stores/StoresPage";
import { ProductCreate } from "./pages/products/ProductsCreate";
import { TransactionCreate } from "./pages/orders/TransactionCreate";

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
        <ContentRoute
          path="/master-data/users/edit/:id"
          component={UsersEdit}
        />
        <ContentRoute
          path="/master-data/users/create"
          component={UsersCreate}
        />
        <ContentRoute path="/master-data/users" component={UsersPage} />

        {/* users */}
        <ContentRoute path="/products/create" component={ProductCreate} />
        <ContentRoute path="/products" component={ProductPage} />

        {/* orders */}
        <ContentRoute path="/transaction/create" component={TransactionCreate} />
        <ContentRoute path="/transaction" component={TransactionPage} />

        {/* merchatns */}
        <ContentRoute
          path="/master-data/merchants/edit/:id"
          component={MerchantsEdit}
        />
        <ContentRoute
          path="/master-data/merchants/create"
          component={MerchantsCreate}
        />
        <ContentRoute path="/master-data/merchants" component={MerchansPage} />

        {/* categories */}
        <ContentRoute
          path="/master-data/categories/edit/:id"
          component={CategoriesEdit}
        />
        <ContentRoute
          path="/master-data/categories/create"
          component={CategoriesCreate}
        />
        <ContentRoute
          path="/master-data/categories"
          component={CategoriesPage}
        />

        {/* stores */}
        <ContentRoute
          path="/master-data/stores/edit/:id"
          component={StoresEdit}
        />
        <ContentRoute
          path="/master-data/stores/create"
          component={StoresCreate}
        />
        <ContentRoute path="/master-data/stores" component={StoresPage} />

        <Route path="/user-profile" component={UserProfilepage} />
        <Redirect to="error/error-v1" />
      </Switch>
    </Suspense>
  );
}

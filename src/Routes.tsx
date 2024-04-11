import React from "react";

import { Navigate, Route, Routes as BaseRoutes } from "react-router-dom";
import Tasks from "./components/Tasks";
import Wallets from "./components/Wallets";

const Routes = () => {
  return (
    <BaseRoutes>
      <Route path="wallets" Component={() => <Wallets />} />
      <Route path="tasks" Component={() => <Tasks />} />
      <Route path="*" element={<Navigate to={"wallets"} />}></Route>
    </BaseRoutes>
  );
};

export default Routes;

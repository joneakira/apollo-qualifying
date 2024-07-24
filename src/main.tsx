import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services/queryclient";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AccountCreationModal from "./components/Accounts/AccountCreationModal";
import { RecoilRoot } from "recoil";
import TransactionsHistoryModal from "./components/Transactions/TransactionsHistoryModal";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        element: (
          <>
            <AccountCreationModal />
          </>
        ),
        path: "/create-account",
      },
      {
        element: (
          <>
            <TransactionsHistoryModal />
          </>
        ),
        path: "/transaction",
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RecoilRoot>
        <RouterProvider router={router} />
      </RecoilRoot>
    </QueryClientProvider>
  </React.StrictMode>
);

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Layout } from "antd";
import { Account } from "./interfaces/account";
import { Header } from "./components/header";
import AccountTable from "./components/Accounts/Table";
import { Outlet } from "react-router-dom";
import apiInstance from "./api/instance";
import { Transaction } from "./interfaces/transaction";
import { endpoints } from "./api/endpoints";
import { transactionsQueryKey } from "./services/queryclient";

function App() {
  const { data, error } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await apiInstance
        .get<Account[]>("accounts")
        .then((res) => res.data);
      return response;
    },
    refetchOnMount: false,
  });
  const { data: transactionsData, error: transactionsError } = useQuery<
    Transaction[]
  >({
    queryKey: [transactionsQueryKey],
    queryFn: async () => {
      const response = await apiInstance
        .get<Transaction[]>(endpoints.transactions)
        .then((res) => res.data);
      return response;
    },
    refetchOnMount: false,
  });

  if (error) return "An error has occurred: " + error.message;
  return (
    <>
      <Layout className="App" style={{ alignItems: "center", width: "100%" }}>
        <Header title="J. Akira Qualifying" />
        <AccountTable accounts={data ?? []} />
      </Layout>
      <Outlet />
    </>
  );
}
export default App;

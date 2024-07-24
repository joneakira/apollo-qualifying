import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Layout } from "antd";
import { Account } from "./interfaces/account";
import { Header } from "./components/header";
import AccountTable from "./components/Accounts/Table";
import { Outlet } from "react-router-dom";

function App() {
  const { data, error, isLoading } = useQuery<Account[]>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const response = await axios
        .get<Account[]>("http://localhost:5000/accounts")
        .then((res) => res.data);
      return response;
    },
  });

  if (error) return "An error has occurred: " + error.message;
  return (
    <>
      <Layout className="App" style={{ alignItems: "center", width: "100%" }}>
        <Header title="J. Akira Qualifying" buttonLabel="New user" />
        <AccountTable accounts={data ?? []} />
      </Layout>
      <Outlet />
    </>
  );
}
export default App;

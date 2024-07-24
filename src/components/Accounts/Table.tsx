import { Button, List, Space, Table, TableProps } from "antd";
import { Account } from "../../interfaces/account";
import AccountTableRow from "./Row";
import { tableStyles } from "../../styles/table";
import { SendOutlined } from "@ant-design/icons";
import { useIsFetching } from "@tanstack/react-query";
import { accountsQueryKey } from "../../services/queryclient";
import { useMemo } from "react";
import { currencyFormatter } from "../../utils/currencyFormatter";

interface IProps {
  accounts: Account[];
}
const columns: TableProps<Account>["columns"] = [
  {
    title: "Name",
    dataIndex: "owner",
    key: "owner",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "e-mail",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    render: (balance) => <b>{currencyFormatter(balance)}</b>,
  },
  {
    title: "Initial Balance",
    dataIndex: "initialBalance",
    key: "initialBalance",
  },
  {
    title: "transfer",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <Button icon={<SendOutlined />} type="primary">
          Transfer
        </Button>
      </Space>
    ),
  },
];
const AccountsTable: React.FC<IProps> = (props) => {
  const { accounts } = props;
  const isFetching = useIsFetching({ queryKey: [accountsQueryKey] });

  const isLoading = useMemo(() => {
    return isFetching > 0;
  }, [isFetching]);
  return (
    <Table
      loading={isLoading}
      dataSource={accounts}
      columns={columns}
      style={tableStyles}
    />
  );
};

export default AccountsTable;

import { Button, Flex, Space, Table, TableProps, Typography } from "antd";
import { Account } from "../../interfaces/account";
import { tableStyles } from "../../styles/table";
import {
  ColumnWidthOutlined,
  SendOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useIsFetching } from "@tanstack/react-query";
import { accountsQueryKey } from "../../services/queryclient";
import { useMemo, useState } from "react";
import { currencyFormatter } from "../../utils/currencyFormatter";
import { useNavigate } from "react-router-dom";

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
    render: (balance) => <b>{currencyFormatter(balance)}</b>,
  },
  {
    title: "Actions",
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
  const [layoutWidth, setLayoutWidth] = useState<"wide" | "narrow">("narrow");
  const navigate = useNavigate();
  const isFetching = useIsFetching({ queryKey: [accountsQueryKey] });

  const isLoading = useMemo(() => {
    return isFetching > 0;
  }, [isFetching]);

  return (
    <Flex
      style={{
        flexDirection: "column",
        width: "100%",
        maxWidth: layoutWidth === "narrow" ? "1024px" : "80%",
      }}
    >
      <Flex
        style={{
          justifyContent: "space-between",
          width: "100%%",
          alignItems: "center",
        }}
      >
        <Typography.Title>Accounts</Typography.Title>
        <Space>
          <Button
            icon={<ColumnWidthOutlined />}
            onClick={() =>
              setLayoutWidth((prevState) =>
                prevState === "narrow" ? "wide" : "narrow"
              )
            }
          >
            toggle {layoutWidth === "narrow" ? "wide" : "narrow"}
          </Button>
          <Button
            loading={isLoading}
            type="primary"
            onClick={() => navigate("/create-account")}
            icon={<UserAddOutlined />}
          >
            Account
          </Button>
        </Space>
      </Flex>
      <Table loading={isLoading} dataSource={accounts} columns={columns} />
    </Flex>
  );
};

export default AccountsTable;

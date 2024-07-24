import {
  Button,
  Flex,
  Space,
  Table,
  TableProps,
  Tooltip,
  Typography,
} from "antd";
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
import React from "react";

interface IProps {
  accounts: Account[];
}
const columns: TableProps<Account>["columns"] = [
  {
    title: "Name",
    dataIndex: "owner",
    key: "owner",
    render: (text, record) => (
      <Space style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <Typography.Text>{text}</Typography.Text>
        <Typography.Link>{record.email}</Typography.Link>
      </Space>
    ),
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
    title: "From To",
    render: (record) => (
      <React.Fragment>
        {record.from}
        <br />
        {record.to}
      </React.Fragment>
    ),
    responsive: ["xs"],
  },
  {
    title: "Actions",
    key: "from",
    render: (_, record) => (
      <Space size="middle">
        <Button icon={<SendOutlined />} type="primary">
          Transfer
        </Button>
      </Space>
    ),
    responsive: ["lg"],
  },
  {
    title: "Actions",
    dataIndex: "to",
    render: (_, record) => (
      <Space size="middle">
        <Tooltip title="Transfer">
          <Button icon={<SendOutlined />} type="primary"></Button>
        </Tooltip>
      </Space>
    ),
    responsive: ["xs"],
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

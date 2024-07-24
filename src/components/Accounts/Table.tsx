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
import { useEffect, useMemo, useState } from "react";
import { currencyFormatter } from "../../utils/currencyFormatter";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import NewTransactionModal from "../Transactions/NewTransactionModal";
import { useRecoilState, useSetRecoilState } from "recoil";
import { recoilTransactionAccounts } from "../../app/atoms";

interface IProps {
  accounts: Account[];
}

const BeginTransaction = ({
  mobile,
  account,
}: {
  mobile: boolean;
  account: Account;
}) => {
  const setTransaction = useSetRecoilState(recoilTransactionAccounts);
  const setTargetEmail = () => {
    setTransaction((prev) =>
      prev
        ? { ...prev, targetEmail: account.email }
        : {
            targetEmail: account.email,
            amount: 0,
            date: new Date().toLocaleTimeString(),
          }
    );
  };
  return mobile ? (
    <Tooltip title="Transfer">
      <Button
        icon={<SendOutlined />}
        onClick={setTargetEmail}
        type="primary"
      ></Button>
    </Tooltip>
  ) : (
    <Button icon={<SendOutlined />} onClick={setTargetEmail} type="primary">
      Transfer
    </Button>
  );
};
const OpenAccountHistoryLink = ({ account }: { account: Account }) => {
  const navigate = useNavigate();
  return (
    <Typography.Link
      onClick={() => navigate("/transaction?accountId=" + account.id)}
    >
      {account.owner}
    </Typography.Link>
  );
};
const columns: TableProps<Account>["columns"] = [
  {
    title: "Name",
    dataIndex: "owner",
    key: "owner",
    render: (text, record) => (
      <Space style={{ flexDirection: "column", alignItems: "flex-start" }}>
        <OpenAccountHistoryLink account={record} />
        <Typography.Text>{record.email}</Typography.Text>
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
    title: "Actions",
    key: "from",
    render: (_, record) => <BeginTransaction mobile={false} account={record} />,
    responsive: ["sm"],
  },
  {
    title: "Actions",
    dataIndex: "to",
    key: "to",
    render: (_, record) => <BeginTransaction mobile account={record} />,
    responsive: ["xs"],
  },
];

const AccountsTable: React.FC<IProps> = (props) => {
  const { accounts } = props;

  const [layoutWidth, setLayoutWidth] = useState<"wide" | "narrow">("narrow");
  const [transaction, setTransaction] = useRecoilState(
    recoilTransactionAccounts
  );
  const navigate = useNavigate();
  const location = useLocation();
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
        <Typography.Title style={{ fontSize: "20px" }}>
          Accounts
        </Typography.Title>
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
      {transaction?.targetEmail && <NewTransactionModal />}
    </Flex>
  );
};

export default AccountsTable;

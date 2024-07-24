import { List, Modal, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  accountsQueryKey,
  queryClient,
  transactionsQueryKey,
} from "../../services/queryclient";
import { useCallback, useMemo } from "react";
import { Transaction } from "../../interfaces/transaction";
import { Account } from "../../interfaces/account";
import { currencyFormatter } from "../../utils/currencyFormatter";

interface TransactionsHistoryModalProps {}

const TransactionsHistoryModal: React.FC<
  TransactionsHistoryModalProps
> = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const transactions: Transaction[] =
    queryClient.getQueryData([transactionsQueryKey]) || [];

  const accounts: Account[] =
    queryClient.getQueryData([accountsQueryKey]) || [];

  const account = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const accountId = params.get("accountId");
    return accounts.find((ac) => ac.id.toString() === accountId);
  }, [accounts]);

  const accountIncomeTransactions = useMemo(() => {
    if (account && transactions) {
      return transactions.filter(
        (transaction) => transaction.targetEmail === account?.email
      );
    }
    return [];
  }, [account, transactions]);

  const accountOutcomeTransactions = useMemo(() => {
    if (account && transactions) {
      return transactions.filter(
        (transaction) => transaction.originEmail === account?.email
      );
    }
    return [];
  }, [accountIncomeTransactions]);

  const transactionsResult = useMemo(() => {
    return accountIncomeTransactions.concat(accountOutcomeTransactions);
  }, [accountOutcomeTransactions, accountIncomeTransactions]);
  const isOutcome = useCallback(
    (item: Transaction) => {
      return accountOutcomeTransactions.some(
        (t) => t.id === item.id && t.accountId === item.accountId
      );
    },
    [accountOutcomeTransactions]
  );
  return (
    <>
      <Modal
        open
        title={"Transactions"}
        onCancel={() => navigate("/")}
        footer={null}
      >
        <Typography.Text>{account?.email}</Typography.Text>
        <List
          itemLayout="horizontal"
          dataSource={transactionsResult}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Typography.Text>
                    {!isOutcome(item) ? <b>From:</b> : <b>To:</b>}{" "}
                    {isOutcome(item) ? item.targetEmail : item.originEmail}
                  </Typography.Text>
                }
                description={<Typography.Text>{item.date}</Typography.Text>}
              />
              <Typography.Text type={isOutcome(item) ? "danger" : "success"}>
                {`${currencyFormatter(item.amount)}`}
              </Typography.Text>
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default TransactionsHistoryModal;

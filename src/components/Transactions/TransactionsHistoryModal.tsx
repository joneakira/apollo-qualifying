import { List, Modal, Typography } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import {
  accountsQueryKey,
  queryClient,
  transactionsQueryKey,
} from "../../services/queryclient";
import { useMemo } from "react";
import { Transaction } from "../../interfaces/transaction";
import { Account } from "../../interfaces/account";

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
  }, [account, transactions]);

  const transactionsResult = useMemo(() => {
    return accountIncomeTransactions
      .concat(accountOutcomeTransactions)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [accountOutcomeTransactions, accountIncomeTransactions]);

  return (
    <>
      <Modal
        open
        title={`Transactions history: ${account?.email}`}
        onCancel={() => navigate("/")}
        footer={null}
      >
        <List
          itemLayout="horizontal"
          dataSource={transactionsResult}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Typography.Text>
                    {item.accountId === account?.id ? <b>To:</b> : <b>From:</b>}{" "}
                    {item.targetEmail}
                  </Typography.Text>
                }
                description={`Amount: $${item.amount}`}
              />
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default TransactionsHistoryModal;

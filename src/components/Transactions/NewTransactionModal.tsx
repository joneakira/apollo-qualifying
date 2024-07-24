import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../../api/endpoints";
import apiInstance from "../../api/instance";
import {
  Button,
  Form,
  InputNumber,
  Modal,
  notification,
  Select,
  Space,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import {
  accountsQueryKey,
  queryClient,
  transactionsQueryKey,
} from "../../services/queryclient";
import { Account } from "../../interfaces/account";
import { Transaction } from "../../interfaces/transaction";
import { currencyFormatter } from "../../utils/currencyFormatter";
import { useRecoilState } from "recoil";
import { recoilTransactionAccounts } from "../../app/atoms";
import { useMemo } from "react";

interface NewTransactionModalProps {}

const NewTransactionModal: React.FC<NewTransactionModalProps> = () => {
  const navigate = useNavigate();
  const accounts: Account[] =
    queryClient.getQueryData([accountsQueryKey]) || [];

  const [transaction, setTransaction] = useRecoilState(
    recoilTransactionAccounts
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<Transaction>({
    defaultValues: {
      originEmail: undefined,
      targetEmail: transaction?.targetEmail,
      amount: 0,
    },
  });

  const originEmailWatcher = watch("originEmail");
  const targetEmailWatcher = watch("targetEmail");

  const targetAccount = useMemo(() => {
    return accounts.find((ac) => ac.email === targetEmailWatcher);
  }, [accounts, targetEmailWatcher]);

  const originAccount = useMemo(() => {
    return accounts.find((ac) => ac.email === originEmailWatcher);
  }, [accounts, originEmailWatcher]);

  const mutation = useMutation({
    mutationFn: async (transaction: Transaction) => {
      return apiInstance
        .post(endpoints.transactions, transaction)
        .then((res) => res.data);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        [transactionsQueryKey],
        (prev: Transaction[] | undefined) => {
          if (!prev) return [{ ...data }];
          return prev.concat([{ ...data }]);
        }
      );
      queryClient.setQueryData(
        [accountsQueryKey],
        (prev: Account[] | undefined) => {
          if (!prev) return prev;

          return prev.map((account) => {
            if (account.email === variables.originEmail) {
              return {
                ...account,
                balance: account.balance - variables.amount,
              };
            }
            if (account.email === variables.targetEmail) {
              return {
                ...account,
                balance: account.balance + variables.amount,
              };
            }
            return account;
          });
        }
      );

      notification.success({
        message: "Transaction Successful",
        description: "The transaction was completed successfully.",
      });

      navigate("/");
    },
    onError: (error) => {
      console.error("Transaction failed:", error);
      notification.error({
        message: "Transaction Failed",
        description: "An error occurred while processing the transaction.",
      });
    },
  });

  const onSubmit = (data: Transaction) => {
    const formattedData = {
      ...data,
      accountId: originAccount?.id,
      date: new Date().toLocaleString(),
    };
    setTransaction(formattedData);
    if (originAccount?.email === targetAccount?.email) {
      notification.warning({
        message: "Transaction Failed",
        description: "Cannot send money to the same account.",
      });
      return;
    }
    if (originAccount?.balance && originAccount.balance < data.amount) {
      notification.warning({
        message: "Transaction Failed",
        description: "Not enough balance.",
      });
      return;
    }
    if (data.amount <= 0) {
      notification.warning({
        message: "Transaction Failed",
        description: "Invalid amount.",
      });
      return;
    }
    mutation.mutate(formattedData);
  };
  return (
    <Modal
      open
      title="New Transaction"
      onCancel={() => setTransaction(undefined)}
      footer={null}
    >
      <Form
        onFinish={handleSubmit(onSubmit)}
        labelCol={{ span: 6 }}
        layout="horizontal"
      >
        <Form.Item
          label="From Account"
          validateStatus={errors.originEmail ? "error" : ""}
          help={errors.originEmail?.message}
        >
          <Controller
            name="originEmail"
            control={control}
            rules={{ required: "From Account is required" }}
            render={({ field }) => (
              <Select
                {...field}
                options={accounts?.map((account: Account) => ({
                  label: `${account.owner} - ${
                    account.email
                  } - ${currencyFormatter(account.balance)}`,
                  value: account.email,
                }))}
              />
            )}
          />
          <Typography.Text>
            <b>Balance:</b> {currencyFormatter(originAccount?.balance)}
          </Typography.Text>
        </Form.Item>

        <Form.Item
          label="To Account"
          validateStatus={errors.targetEmail ? "error" : ""}
          help={errors.targetEmail?.message}
        >
          <Controller
            name="targetEmail"
            control={control}
            rules={{ required: "To Account is required" }}
            render={({ field }) => (
              <Select
                options={accounts?.map((account: Account) => ({
                  label: `${account.owner} - ${account.email}`,
                  value: account.email,
                }))}
                {...field}
              />
            )}
          />
          <Typography.Text>
            <b>Balance:</b> {currencyFormatter(targetAccount?.balance)}
          </Typography.Text>
        </Form.Item>
        <Form.Item
          label="Amount"
          validateStatus={errors.amount ? "error" : ""}
          help={errors.amount?.message}
        >
          <Controller
            name="amount"
            control={control}
            rules={{ required: "Amount is required" }}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={0}
                disabled={!targetAccount}
                max={originAccount?.balance}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            )}
          />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Space
            style={{
              justifyContent: "flex-end",
            }}
          >
            <Button type="primary" danger onClick={() => navigate("/")}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default NewTransactionModal;

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
} from "antd";
import { useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { accountsQueryKey, queryClient } from "../../services/queryclient";
import { Account } from "../../interfaces/account";
import { Transaction } from "../../interfaces/transaction";

interface NewTransactionModalProps {}

const NewTransactionModal: React.FC<NewTransactionModalProps> = () => {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Transaction>({
    defaultValues: {
      originEmail: undefined,
      targetEmail: undefined,
      amount: 0,
    },
  });

  const accounts: Account[] =
    queryClient.getQueryData([accountsQueryKey]) || [];

  const mutation = useMutation({
    mutationFn: async (transaction: Transaction) => {
      return apiInstance
        .post(endpoints.transactions, transaction)
        .then((res) => res.data);
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(
        ["accounts"],
        (oldData: Account[] | undefined) => {
          if (!oldData) return oldData;

          return oldData.map((account) => {
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
    mutation.mutate(data);
  };
  return (
    <Modal
      open
      title="New Transaction"
      onCancel={() => navigate("/")}
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
                  label: `${account.owner} - ${account.email}`,
                  value: account.id,
                }))}
              />
            )}
          />
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
                {...field}
                options={accounts?.map((account: Account) => ({
                  label: `${account.owner} - ${account.email}`,
                  value: account.id,
                }))}
              />
            )}
          />
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

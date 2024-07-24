import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Space,
} from "antd";
import { Controller, SubmitErrorHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Account } from "../../interfaces/account";
import { accountFormInputStyles } from "../../styles/accountForm";
import { currencyFormatter } from "../../utils/currencyFormatter";
import { useMutation } from "@tanstack/react-query";
import { endpoints } from "../../api/endpoints";
import apiInstance from "../../api/instance";
import { accountsQueryKey, queryClient } from "../../services/queryclient";

interface AccountCreationModalProps {}

const AccountCreationModal: React.FC<AccountCreationModalProps> = () => {
  const navigate = useNavigate();

  const queryData: Account[] =
    queryClient.getQueryData([accountsQueryKey]) || [];

  const {
    control,
    handleSubmit,
    formState: { errors },
    ...hookForm
  } = useForm<Account>({
    defaultValues: {
      owner: "",
      email: "",
      initialBalance: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (account: Account) => {
      return apiInstance.post(endpoints.accounts, account);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["accounts"], (oldData: any) => {
        if (oldData) {
          return [...oldData, data];
        }
        return [data];
      });

      notification.success({
        message: "User Registered",
        description: (
          <>
            User <b>{hookForm.getValues("owner")}</b> -{" "}
            <b>{hookForm.getValues("email")}</b> has been registered
            successfully.
          </>
        ),
      });
      setTimeout(() => {
        navigate("/");
      }, 300);
    },
    onError: (error) => {
      console.error("Error registering user:", error);
      notification.error({
        message: "Registration Failed",
        description: "An error occurred while registering the user.",
      });
    },
  });

  const onSubmit = (account: Account) => {
    if (queryData.find((dbAccount) => dbAccount.email === account.email)) {
      notification.warning({
        message: "Registration Failed",
        description: "e-mail already binded to another user.",
      });
      return;
    }

    mutation.mutate({ ...account, balance: account.initialBalance });
  };

  return (
    <>
      <Modal
        open
        title="New Account"
        onCancel={() => navigate("/")}
        footer={[<></>]}
      >
        <Form
          onFinish={handleSubmit(onSubmit)}
          labelCol={{ span: 6 }}
          layout="horizontal"
        >
          <Form.Item
            label="Owner"
            validateStatus={errors.owner ? "error" : ""}
            help={errors.owner?.message}
          >
            <Controller
              name="owner"
              control={control}
              rules={{ required: "Owner is required" }}
              render={({ field }) => (
                <Input style={accountFormInputStyles} autoFocus {...field} />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? "error" : ""}
            help={errors.email?.message}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <Input style={accountFormInputStyles} {...field} />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Initial Balance"
            validateStatus={errors.initialBalance ? "error" : ""}
            help={errors.initialBalance?.message}
          >
            <Controller
              name="initialBalance"
              control={control}
              rules={{ required: "Initial Balance is required" }}
              render={({ field }) => (
                <InputNumber
                  style={accountFormInputStyles}
                  formatter={(value) => currencyFormatter(value)}
                  {...field}
                />
              )}
            />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Space
              style={{
                width: "100%",
                justifyContent: "flex-end",
              }}
            >
              <Button type="primary" danger onClick={() => navigate("/")}>
                Cancel
              </Button>

              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AccountCreationModal;

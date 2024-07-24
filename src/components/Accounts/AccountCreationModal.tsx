import {
  Button,
  Flex,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Space,
} from "antd";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Account } from "../../interfaces/account";
import { accountFormInputStyles } from "../../styles/accountForm";
import { currencyFormatter } from "../../utils/currencyFormatter";

interface AccountCreationModalProps {}

const AccountCreationModal: React.FC<AccountCreationModalProps> = () => {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Account>({
    defaultValues: {
      owner: "",
      email: "",
      initialBalance: 0,
    },
  });

  const onSubmit = (data: Account) => {
    console.log("User Registered:", data);
    notification.success({
      message: "User Registered",
      description: (
        <>
          User <b>{data.owner}</b> - <b>{data.email}</b> has been registered
          successfully.
        </>
      ),
    });
  };
  return (
    <>
      <Form
        onFinish={handleSubmit(onSubmit)}
        labelCol={{ span: 6 }}
        layout="horizontal"
      >
        <Modal
          open
          title="New Account"
          onCancel={() => navigate("/")}
          footer={[
            <Space
              style={{
                justifyContent: "flex-end",
              }}
            >
              <Button type="primary" danger>
                Cancel
              </Button>

              <Button type="primary" htmlType="submit">
                Create
              </Button>
            </Space>,
          ]}
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
                <Input style={accountFormInputStyles} {...field} />
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
        </Modal>
      </Form>
    </>
  );
};

export default AccountCreationModal;

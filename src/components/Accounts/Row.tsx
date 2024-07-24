import { Button, List } from "antd";
import { Account } from "../../interfaces/account";

interface IProps {
  account: Account;
}

const AccountsTableRow: React.FC<IProps> = (props) => {
  const { account } = props;
  return (
    <List.Item>
      <List.Item.Meta
        title={<a href="https://ant.design">{account.owner}</a>}
        description={`Balance: $${account.balance ?? account.initialBalance}`}
      />
      <Button type="primary">Transfer</Button>
    </List.Item>
  );
};

export default AccountsTableRow;

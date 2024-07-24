import { Modal } from "antd";
import { useNavigate, useParams } from "react-router-dom";

interface TransactionsHistoryModalProps {}

const TransactionsHistoryModal: React.FC<
  TransactionsHistoryModalProps
> = () => {
  const params = useParams();
  const navigate = useNavigate();
  return (
    <>
      <Modal
        open
        title="Transactions History"
        onCancel={() => navigate("/")}
        footer={[<></>]}
      ></Modal>
    </>
  );
};

export default TransactionsHistoryModal;

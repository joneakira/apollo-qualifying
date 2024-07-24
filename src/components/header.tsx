import { FC } from "react";
import { Button, Layout, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { headerStyles } from "../styles/header";
import { blue } from "@ant-design/colors";
import { useNavigate } from "react-router-dom";
const { Header: AntHeader } = Layout;

interface IProps {
  title: string;
  buttonLabel: string;
}

export const Header: FC<IProps> = (props) => {
  const { title, buttonLabel } = props;
  const navigate = useNavigate();
  return (
    <AntHeader style={headerStyles}>
      <Typography.Text style={{ color: "#8dc5f8", fontSize: "20px" }}>
        {title}
      </Typography.Text>
      <Button
        type="primary"
        onClick={() => navigate("/create-account")}
        icon={<UserAddOutlined />}
      >
        {buttonLabel}
      </Button>
    </AntHeader>
  );
};

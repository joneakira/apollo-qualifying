import { FC, useMemo } from "react";
import { Button, Layout, Typography } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { headerStyles } from "../styles/header";
import { useNavigate } from "react-router-dom";
import { useIsFetching } from "@tanstack/react-query";
import { accountsQueryKey } from "../services/queryclient";
const { Header: AntHeader } = Layout;

interface IProps {
  title: string;
  buttonLabel: string;
}

export const Header: FC<IProps> = (props) => {
  const { title, buttonLabel } = props;
  const navigate = useNavigate();

  const isFetching = useIsFetching({ queryKey: [accountsQueryKey] });

  const isLoading = useMemo(() => {
    return isFetching > 0;
  }, [isFetching]);

  return (
    <AntHeader style={headerStyles}>
      <Typography.Text style={{ color: "#8dc5f8", fontSize: "20px" }}>
        {title}
      </Typography.Text>
      <Button
        loading={isLoading}
        type="primary"
        onClick={() => navigate("/create-account")}
        icon={<UserAddOutlined />}
      >
        {buttonLabel}
      </Button>
    </AntHeader>
  );
};

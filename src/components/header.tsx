import { FC } from "react";
import { Layout, Typography } from "antd";
import { headerStyles } from "../styles/header";
const { Header: AntHeader } = Layout;

interface IProps {
  title: string;
}

export const Header: FC<IProps> = (props) => {
  const { title } = props;

  return (
    <AntHeader style={headerStyles}>
      <Typography.Text style={{ color: "#8dc5f8", fontSize: "20px" }}>
        {title}
      </Typography.Text>
    </AntHeader>
  );
};

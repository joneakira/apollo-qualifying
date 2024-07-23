import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { List, Button } from "antd";
function App() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => {
      const response = axios.get("http://localhost:5000/accounts");
      return response;
    },
  });
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error.message;
  return (
    <div className="App">
      <Button type="primary">Add</Button>
      <List
        itemLayout="horizontal"
        dataSource={data.data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<a href="https://ant.design">{item.owner}</a>}
              description={`Balance: $${item.balance}`}
            />
            <Button type="primary">Transfer</Button>
          </List.Item>
        )}
      />
    </div>
  );
}
export default App;

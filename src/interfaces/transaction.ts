interface Transaction {
  id: number;
  accountId: number;
  amount: number;
  date: string;
  description?: string;
}

export interface Transaction {
  id?: number;
  accountId?: number;
  originEmail?: string;
  targetEmail?: string;
  amount: number;
  date?: string;
  description?: string;
}

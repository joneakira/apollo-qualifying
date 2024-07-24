import { atom } from "recoil";
import { Transaction } from "../interfaces/transaction";

const transactionAccounts = atom<Transaction | undefined>({
  key: "transaction",
  default: undefined,
});

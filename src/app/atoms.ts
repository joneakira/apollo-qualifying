import { atom } from "recoil";
import { Transaction } from "../interfaces/transaction";

export const recoilTransactionAccounts = atom<Transaction | undefined>({
  key: "transaction",
  default: undefined,
});

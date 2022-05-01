import IUser from "./IUser";

interface ITransactions {
  id: string;
  areaDeGasto: string;
  value: number;
  transactionType: string;
  User?: IUser;
  userId?: string;
}

export default ITransactions;

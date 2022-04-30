import ITransactions from "./ITransactions";

interface IUser {
  id: string;
  email: string;
  password: string;
  username: string;
  transactions: ITransactions[];
}

export default IUser;

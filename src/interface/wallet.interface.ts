export interface IWallet {
  id: number;
  pubkey: string;
  secretKey: string;
}

export interface ITask {
  id: number;
  collectionUrl: string;
  maxSolBid: number;
  collectionSlug: string;
  minSolAsk: number;
  bidQty: number;
  askQty: number;
  accountId: number;
  status: TasksStatus;
  rpcNode: string;
  bidMode: number;
  collectionKey: string;
}

export enum TasksStatus {
  MonitoringBids,
  Executed,
  Canceled,
}

export enum BidMode {
  Aggressive,
  Passive,
  AggressiveMatch,
  PassiveMatch,
}

export interface ITaskDto {
  collectionUrl: string;
  maxSolBid: number;
  minSolAsk: number;
  bidQty: number;
  askQty: number;
  account: number;
  monitorDelay: number;
  bidMode: number;
  rpcNode: string;
}

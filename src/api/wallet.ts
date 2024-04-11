import axios from "axios";
import { apiClient } from ".";
import { IWallet } from "../interface/wallet.interface";

const apiUrl = "http://localhost:5000";

export async function getWallets(): Promise<IWallet[]> {
  const { data } = await axios.get("http://localhost:5000" + "/account/all");

  return data.accounts.map((acc: any) => ({
    id: acc.id,
    pubkey: acc.public_key,
    secretKey: "•".repeat(acc.secret_key.length - 8) + acc.secret_key.slice(-8),
  }));
}

export async function createNewWallet(keypair: string) {
  const { data } = await axios.post(`${apiUrl}/account/create`, {
    keypair,
  });

  return data;
}

export async function deleteWallet(id: number) {
  const { data } = await axios.delete(`${apiUrl}/account/${id}`);

  return data;
}

export async function getToken() {
  const response = await axios.get(`${apiUrl}/account/token`);

  return response.data;
}

export async function login(token: string) {
  const response = await axios.get(`${apiUrl}/account/login/${token}`);

  return response.data;
}

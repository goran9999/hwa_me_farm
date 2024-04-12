import axios from "axios";
import { ITaskDto } from "../interface/wallet.interface";

const apiUrl = "http://localhost:5000";

export async function getAllTasks() {
  const { data } = await axios.get(`${apiUrl}/task/all`);

  return data.tasks;
}

export async function createTask(dto: ITaskDto) {
  const { data } = await axios.post(`${apiUrl}/task/create`, { ...dto });

  return data;
}

export async function stopTask(id: number) {
  const { data } = await axios.patch(`${apiUrl}/task/stop/${id}`);

  return data;
}

export async function startTask(collectionSlug: string) {
  const { data } = await axios.patch(`${apiUrl}/task/start/${collectionSlug}`);
  return data;
}

export async function deleteTask(taskId: number) {
  const { data } = await axios.delete(`${apiUrl}/task/${taskId}`);

  return data;
}
export async function updateTask(task: ITaskDto, taskId: number) {
  const { data } = await axios.patch(`${apiUrl}/task/update/${taskId}`, {
    ...task,
  });

  return data;
}

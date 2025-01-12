export interface ITask {
    id: number;
    title: string;
    description: string;
    status: "pending" | "completed";
    deadline: Date;
    user_id: number;
  }
  
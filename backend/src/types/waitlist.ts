export interface WaitlistEntry {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWaitlistData {
  email: string;
}


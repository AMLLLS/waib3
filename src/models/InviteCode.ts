export interface IInviteCode {
  _id?: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: Date;
  createdAt: Date;
} 
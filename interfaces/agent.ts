// Agent Status Enum
export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

  export interface AgentInterface {
  id: number;
  fullName: string;
  address: string;
  email: string;
  phone: string;
  age: number;
  experience?: string;
  bio?: string;
  nidNumber: string;
  nidImage?: string;
  status: AgentStatus;
  isEmailVerified: boolean;
}

export interface CreateAgentInterface {
  fullName: string;
  address: string;
  email: string;
  password: string;
  phone: string;
  age: number;
  experience?: string;
  bio?: string;
  nidNumber: string;
  nidImage?: string | File;
  status?: AgentStatus;
}

export interface PatchAgentInterface{
  fullName?: string;
  address?: string;
  email?: string;
  password?: string;
  phone?: string;
  age?: number;
  experience?: string;
  bio?: string;
  nidNumber?: string;
  nidImage?: string | File;
  status?: AgentStatus;
}

export interface LoginAgentInterface {
  email: string;
  password: string;
}



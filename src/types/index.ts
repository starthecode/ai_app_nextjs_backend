import { Document } from 'mongodb';

// ====== USER PARAMS
export type UserSessionParams = {
  id: string;
  name: string;
  email: string;
  image: string;
  roles: string[];
};

export type SessionParams = {
  session: {
    id: string;
    name: string;
    email: string;
    image: string;
    roles: string[];
  };
};

// ====== Ai Midel PARAMS
export type AiModelParams = {
  data: {
    name: string;
    aiModelName: string;
    defaultPrompt: string;
    icon: string;
  };
};

export type AiModelFormParams = {
  id?: string;
  name: string;
  aiModelName: string;
  aiModelType: string;
  defaultPrompt: string;
  icon: string;
};

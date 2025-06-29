export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system', // For errors or system-generated info
}

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
}

export interface Persona {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  welcomeMessage: string;
}

export interface IMessage {
  type: string;
  content: any;
  metadata?: Record<string, any>;
  timestamp: Date;
}

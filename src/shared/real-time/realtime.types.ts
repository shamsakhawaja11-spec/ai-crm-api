export enum RealtimeEvent {
  CONNECTED = 'realtime.connected',

  NOTIFICATION_CREATED = 'notification.created',

  LEAD_CREATED = 'lead.created',
  LEAD_UPDATED = 'lead.updated',
  LEAD_CONVERTED = 'lead.converted',

  DEAL_CREATED = 'deal.created',
  DEAL_UPDATED = 'deal.updated',
  DEAL_STAGE_MOVED = 'deal.stage_moved',
  DEAL_WON = 'deal.won',
  DEAL_LOST = 'deal.lost',

  TASK_CREATED = 'task.created',
  TASK_UPDATED = 'task.updated',
  TASK_COMPLETED = 'task.completed',
}

export interface RealtimePayload<T = unknown> {
  event: RealtimeEvent;
  data: T;
  timestamp: string;
}
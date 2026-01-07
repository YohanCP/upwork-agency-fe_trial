import { z } from 'zod';

// List of Items will shown on the feed
export const FeedEnum = z.enum(['News', 'Market', 'Price']);

// just a standard schema for convenience
export const EventSchema = z.object({
    id: z.string(),
    feed: FeedEnum,
    ts: z.number(),
    title: z.string(),
    body: z.string().optional(),
});

export type BaseEvent = z.infer<typeof EventSchema>;
export type FeedType = z.infer<typeof FeedEnum> | "All";
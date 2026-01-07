import { BaseEvent, EventSchema } from "@/lib/schema";
import { useCallback, useEffect, useRef, useState } from "react";

export function useSocket(url: string){
    const [events, setEvents] = useState<Map<String, BaseEvent>>(new Map());
    const [status, setStatus] = useState<'Connecting...' | 'Connected' | 'Disconnected'>('Disconnected');
    const reconnectAttempts = useRef(0);
    const socketRef = useRef<WebSocket | null>(null);

    const connect = useCallback(() => {
        try{
            const ws = new WebSocket(url);
            socketRef.current = ws;
            setStatus('Connecting...');
            
            // Opened Connection
            ws.onopen = () => {
                setStatus('Connected');
                reconnectAttempts.current = 0;
            };

            ws.onmessage = (event) => {
                try{
                    const rawData = JSON.parse(event.data);
                    const result = EventSchema.safeParse(rawData);
                    
                    if(result.success){
                        setEvents((prev) => {
                            const newMap = new Map(prev);

                            // For automatically dedupe by the id
                            newMap.set(result.data.id, result.data);
                            return newMap;
                        });
                    }
                } catch(e){
                    console.error("Failed to parse message", e);
                }
            };
            
            // Closed connection
            ws.onclose = () => {
                setStatus('Disconnected');
                const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
                setTimeout(() => {
                    reconnectAttempts.current++;
                    connect();
                }, delay);
            };
        } catch(e){
                console.error("Connection error!", e);
        };
    }, [url]);

    useEffect(() => {
        connect();
        return () => socketRef.current?.close();
    }, [connect])

    return {
        events: Array.from(events.values()).sort((a, b) => b.ts - a.ts),
        status
    }
}
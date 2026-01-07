'use client';

import { useState, useMemo } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Signal, SignalLow, WifiOff } from 'lucide-react';

// Status icon function
function StatusIcon({ status }: { status: string }) {
  if (status === 'Connected') return <Signal className="h-4 w-4 text-green-500" />;
  if (status === 'Connecting...') return <SignalLow className="h-4 w-4 text-amber-500 animate-pulse" />;
  return <WifiOff className="h-4 w-4 text-red-500" />;
}

export default function FeedPage() {
  // Use hook
  const { events, status } = useSocket('ws://localhost:8080');
  
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesTab = activeTab === 'All' || event.feed === activeTab;
      const matchesSearch = 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.body?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }, [events, activeTab, searchQuery]);

  return (
    <div className="container mx-auto max-w-5xl py-8 px-4 space-y-6">
      {/* Header section with status state */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Activity</h1>
          <p className="text-muted-foreground">Monitoring incoming data streams</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-full">
          <StatusIcon status={status} />
          <span className="text-sm font-medium">{status}</span>
        </div>
      </div>

      {/* Search + Tabs section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search titles or content..." 
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="All" className="md:col-span-2" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="All">All Feeds</TabsTrigger>
            <TabsTrigger value="News">News</TabsTrigger>
            <TabsTrigger value="Market">Market</TabsTrigger>
            <TabsTrigger value="Price">Price</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Scrollable Feed Area */}
      <ScrollArea className="h-150 rounded-xl border bg-slate-50/50 p-4">
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="transition-all duration-200 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between py-3 space-y-0">
                <CardTitle className="text-base font-semibold">{event.title}</CardTitle>
                <Badge variant="outline" className="capitalize">{event.feed.toLowerCase()}</Badge>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  {event.body || "No additional details provided."}
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t text-[11px] text-muted-foreground">
                  <span>ID: {event.id}</span>
                  <span>•</span>
                  <span>{new Date(event.ts).toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground">No events match your current filters.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
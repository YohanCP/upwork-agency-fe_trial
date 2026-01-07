'use client';

import { useSocket } from "@/hooks/useSocket";
import { useMemo, useState } from "react";

export default function FeedPage(){
    // Call the hook
    const { events, status } = useSocket('ws://localhost:8080');

    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filtering Logic
    const filterEvents = useMemo(() => {
        return events.filter((event) => {
            const matchesTab = activeTab === "All" || event.feed === activeTab;
            const matchesSearch = event.title.toLocaleLowerCase().includes(searchQuery.toLowerCase()) || event.body?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesTab && matchesSearch;
        });
    }, [events, activeTab, searchQuery]);

    return(
        <div className="container max-w-5xl py-8 space-y-6">
            
        </div>
    )
}
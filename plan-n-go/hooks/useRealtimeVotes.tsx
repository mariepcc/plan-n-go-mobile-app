import { useEffect, useState } from "react";
import { supabase } from "../app/lib/supabase-client";

const useRealtimeVotes = () => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    const channel = supabase
      .channel('realtime-votes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'votes',
        },
        (payload) => {
          console.log("🔄 Vote changed:", payload);
          fetchVotes(); 
        }
      )
      .subscribe();

    const fetchVotes = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('place_id');

      if (error) console.error(error);
      else setVotes(data);
    };

    fetchVotes();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return votes;
};

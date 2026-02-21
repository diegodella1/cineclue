import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

export function useRanking() {
  const [ranking, setRanking] = useState([])
  const [userPosition, setUserPosition] = useState(null)
  const [weekStart, setWeekStart] = useState(null)
  const [total, setTotal] = useState(0)
  const [hallOfFame, setHallOfFame] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('current') // 'current' | 'history'
  const user = useAuthStore(s => s.user)

  const loadRanking = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase.rpc('cc_get_ranking', {
      p_user_id: user?.id || null,
      p_limit: 50,
      p_offset: 0,
    })
    if (!error && data) {
      setRanking(data.ranking || [])
      setUserPosition(data.user_position)
      setWeekStart(data.week_start)
      setTotal(data.total)
    }
    setLoading(false)
  }, [user])

  const loadHallOfFame = useCallback(async () => {
    const { data } = await supabase
      .from('cc_hall_of_fame')
      .select('*, cc_profiles(username, display_name)')
      .order('week_start', { ascending: false })
      .order('position', { ascending: true })
      .limit(30)
    setHallOfFame(data || [])
  }, [])

  useEffect(() => {
    loadRanking()
    loadHallOfFame()

    // Subscribe to realtime updates
    const channel = supabase
      .channel('cc_weekly_rankings_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cc_weekly_rankings' }, () => {
        loadRanking()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [loadRanking, loadHallOfFame])

  return {
    ranking, userPosition, weekStart, total,
    hallOfFame, loading, tab, setTab, loadRanking,
  }
}

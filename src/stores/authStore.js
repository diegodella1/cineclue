import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  session: null,
  loading: true,

  init: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      set({ session, user: session.user })
      await get().fetchProfile(session.user.id)
    }
    set({ loading: false })

    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session, user: session?.user || null })
      if (session?.user) {
        await get().fetchProfile(session.user.id)
      } else {
        set({ profile: null })
      }
    })
  },

  fetchProfile: async (userId) => {
    const { data } = await supabase
      .from('cc_profiles')
      .select('*')
      .eq('id', userId)
      .single()
    set({ profile: data })
  },

  updateProfile: async (updates) => {
    const user = get().user
    if (!user) return
    const { data, error } = await supabase
      .from('cc_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()
    if (!error) set({ profile: data })
    return { data, error }
  },

  needsOnboarding: () => {
    const profile = get().profile
    if (!profile) return false
    return profile.username.startsWith('user_')
  },
}))

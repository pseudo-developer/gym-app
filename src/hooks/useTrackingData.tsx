
import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useToast } from '@/components/ui/use-toast'

export interface TrackingEntry {
  id?: string
  date: string
  gym: boolean
  diet: boolean
  gym_notes?: string
  diet_notes?: string
}

export const useTrackingData = (userId: string | undefined, trackFromDate: string) => {
  const [trackingData, setTrackingData] = useState<Record<string, TrackingEntry>>({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!userId || !isSupabaseConfigured) {
      setLoading(false)
      return
    }
    
    fetchTrackingData()
  }, [userId, trackFromDate])

  const fetchTrackingData = async () => {
    if (!userId || !isSupabaseConfigured) return

    try {
      const { data, error } = await supabase
        .from('tracking_data')
        .select('*')
        .eq('user_id', userId)
        .gte('date', trackFromDate)
        .order('date', { ascending: false })

      if (error) throw error

      const dataMap: Record<string, TrackingEntry> = {}
      data?.forEach(entry => {
        dataMap[entry.date] = {
          id: entry.id,
          date: entry.date,
          gym: entry.gym,
          diet: entry.diet,
          gym_notes: entry.gym_notes || undefined,
          diet_notes: entry.diet_notes || undefined,
        }
      })

      setTrackingData(dataMap)
    } catch (error) {
      console.error('Error fetching tracking data:', error)
      toast({
        title: "Error",
        description: "Failed to load tracking data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveTrackingData = async (date: string, data: Omit<TrackingEntry, 'date'>) => {
    if (!userId || !isSupabaseConfigured) {
      toast({
        title: "Error",
        description: "Database not configured. Please connect to Supabase.",
        variant: "destructive",
      })
      return false
    }

    try {
      const dateStr = date
      const existingEntry = trackingData[dateStr]

      const entryData = {
        user_id: userId,
        date: dateStr,
        gym: data.gym,
        diet: data.diet,
        gym_notes: data.gym_notes || null,
        diet_notes: data.diet_notes || null,
        updated_at: new Date().toISOString(),
      }

      let result
      if (existingEntry?.id) {
        // Update existing entry
        result = await supabase
          .from('tracking_data')
          .update(entryData)
          .eq('id', existingEntry.id)
          .select()
          .single()
      } else {
        // Create new entry
        result = await supabase
          .from('tracking_data')
          .insert({
            ...entryData,
            created_at: new Date().toISOString(),
          })
          .select()
          .single()
      }

      if (result.error) throw result.error

      // Update local state
      setTrackingData(prev => ({
        ...prev,
        [dateStr]: {
          id: result.data.id,
          date: dateStr,
          gym: data.gym,
          diet: data.diet,
          gym_notes: data.gym_notes,
          diet_notes: data.diet_notes,
        }
      }))

      toast({
        title: "Saved",
        description: `Tracking data for ${new Date(dateStr).toLocaleDateString()} has been saved.`,
      })

      return true
    } catch (error) {
      console.error('Error saving tracking data:', error)
      toast({
        title: "Error",
        description: "Failed to save tracking data",
        variant: "destructive",
      })
      return false
    }
  }

  return {
    trackingData,
    loading,
    saveTrackingData,
    refetch: fetchTrackingData,
  }
}

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import EnhancedStatsBar from "@/components/EnhancedStatsBar";
import DayDetail from "@/components/DayDetail";
import { useTrackingData } from "@/hooks/useTrackingData"; // <-- updated import


// this function is being called at line 
import { formatPrettyDate ,  toLocalDateString} from "@/utils/dateUtils";

// Mock data for guest mode
const generateMockData = () => {
  const data: Record<string, any> = {};
  const startDate = new Date('2025-05-01');
  const endDate = new Date('2025-05-31');
  
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (Math.random() > 0.3) {
      const dateStr = toLocalDateString(d); // <-- use local date string
      data[dateStr] = {
        gym: Math.random() > 0.3,
        diet: Math.random() > 0.4,
        gym_notes: Math.random() > 0.7 ? "Great workout!" : undefined,
        diet_notes: Math.random() > 0.8 ? "Stayed on track" : undefined,
      };
    }
  }
  return data;
};

interface DashboardProps {
  trackFromDate: string;
  userId?: string;
  isGuest?: boolean;
}

const Dashboard = ({ trackFromDate, userId, isGuest = false }: DashboardProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showDetail, setShowDetail] = useState(false);
  const [guestData, setGuestData] = useState(() => generateMockData());

  const { trackingData: dbData, loading, saveTrackingData } = useTrackingData(
    isGuest ? undefined : userId, 
    trackFromDate
  );

  // Use guest data for demo mode, database data for authenticated users
  const trackingData = isGuest ? guestData : dbData;

  // Filter data based on trackFromDate
  const filteredData = useMemo(() => {
    const fromDate = new Date(trackFromDate);
    return Object.fromEntries(
      Object.entries(trackingData).filter(([dateStr]) => {
        const date = new Date(dateStr);
        return date >= fromDate;
      })
    );
  }, [trackingData, trackFromDate]);

  const calculateStats = () => {
    const entries = Object.entries(filteredData);
    const totalDays = entries.length;
    const gymDays = entries.filter(([, day]) => day.gym).length;
    const dietDays = entries.filter(([, day]) => day.diet).length;
    const perfectDays = entries.filter(([, day]) => day.gym && day.diet).length;
    const gymNoDietDays = entries.filter(([, day]) => day.gym && !day.diet).length;

  // Count days excluding Sundays
  const totalDaysExcludingSundays = entries.filter(([dateStr]) => {
    const date = new Date(dateStr);
    return date.getDay() !== 0; // 0 = Sunday
  }).length;
    
    const gymSuccessRate = totalDays > 0 ? Math.round((gymDays / totalDays) * 100) : 0;
    const dietSuccessRate = totalDays > 0 ? Math.round((dietDays / totalDays) * 100) : 0;
    const perfectDayRate = totalDays > 0 ? Math.round((perfectDays / totalDays) * 100) : 0;
    
    // Calculate current streaks
    const sortedDates = Object.keys(filteredData).sort().reverse();
    let currentGymStreak = 0;
    let currentDietStreak = 0;
    let currentPerfectStreak = 0;
    
    for (const dateStr of sortedDates) {
      const day = filteredData[dateStr];
      if (day.gym) currentGymStreak++;
      else break;
    }
    
    for (const dateStr of sortedDates) {
      const day = filteredData[dateStr];
      if (day.diet) currentDietStreak++;
      else break;
    }
    
    for (const dateStr of sortedDates) {
      const day = filteredData[dateStr];
      if (day.gym && day.diet) currentPerfectStreak++;
      else break;
    }
    
    return {
      totalDays,
      totalDaysExcludingSundays,
      gymDays,
      dietDays,
      perfectDays,
      gymNoDietDays,
      gymSuccessRate,
      dietSuccessRate,
      perfectDayRate,
      currentGymStreak,
      currentDietStreak,
      currentPerfectStreak
    };
  };

  const handleDayClick = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setShowDetail(true);
    }
  };

  const handleSaveData = async (date: Date, data: { gym: boolean; diet: boolean; gymNotes?: string; dietNotes?: string }) => {
    const dateStr = toLocalDateString(date); // <-- use local date string
    
    if (isGuest) {
      // Guest mode - update local state
      setGuestData(prev => ({
        ...prev,
        [dateStr]: {
          gym: data.gym,
          diet: data.diet,
          gym_notes: data.gymNotes,
          diet_notes: data.dietNotes,
        }
      }));
      setShowDetail(false);
    } else {
      // Authenticated user - save to database
      const success = await saveTrackingData(dateStr, {
        gym: data.gym,
        diet: data.diet,
        gym_notes: data.gymNotes,
        diet_notes: data.dietNotes,
      });
      
      if (success) {
        setShowDetail(false);
      }
    }
  };

  const modifiers = {
    greenDay: (date: Date) => {
      const dateString = toLocalDateString(date); // <-- use local date string
      const dayData = trackingData[dateString];
      return !!(dayData && dayData.gym && dayData.diet);
    },
    redDay: (date: Date) => {
      const dateString = toLocalDateString(date); // <-- use local date string
      const dayData = trackingData[dateString];
      return !!(dayData && !dayData.gym && !dayData.diet);
    },
    yellowDay: (date: Date) => {
      const dateString = toLocalDateString(date); // <-- use local date string
      const dayData = trackingData[dateString];
      return !!(dayData && dayData.gym && !dayData.diet);
    },
    blueDay: (date: Date) => {
      const dateString = toLocalDateString(date); // <-- use local date string
      const dayData = trackingData[dateString];
      return !!(dayData && !dayData.gym && dayData.diet);
    }
  };

  const modifiersClassNames = {
    greenDay: "bg-green-200 text-green-800 font-bold",
    redDay: "bg-red-200 text-red-800 font-bold",
    yellowDay: "bg-yellow-200 text-yellow-800 font-bold",
    blueDay: "bg-blue-200 text-blue-800 font-bold"
  };

  const defaultMonth = new Date(2025, 4); // May 2025

  if (loading && !isGuest) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  return (
    <div>
      <EnhancedStatsBar stats={calculateStats()} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tracking Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1 bg-green-200 rounded"></div>
                  <span>Both Gym & Diet</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1 bg-yellow-200 rounded"></div>
                  <span>Gym only</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1 bg-blue-200 rounded"></div>
                  <span>Diet only</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 mr-1 bg-red-200 rounded"></div>
                  <span>Both skipped</span>
                </div>
              </div>
            </div>
            
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={handleDayClick}
              className="rounded-md border"
              modifiers={modifiers}
              modifiersClassNames={modifiersClassNames}
              defaultMonth={defaultMonth}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>
              {showDetail && selectedDate 
                ? `Details for ${formatPrettyDate(selectedDate)}`
                : "Today's Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showDetail && selectedDate ? (
              <DayDetail 
                date={selectedDate} 
                data={trackingData[toLocalDateString(selectedDate)]} // <-- use local date string
                onSave={(data) => handleSaveData(selectedDate, data)}
              />
            ) : (
              <div className="text-center py-6">
                <p className="mb-4">Select a date to view or add tracking details.</p>
                <Button onClick={() => {
                  const today = new Date();
                  setSelectedDate(today);
                  handleDayClick(today);
                }}>
                  Track Today
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
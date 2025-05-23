import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsBar from "@/components/StatsBar";
import DayDetail from "@/components/DayDetail";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown } from "lucide-react";

// Updated mock data with current dates for testing - using May 2025 (current month)
const currentDate = new Date();
const currentYear = 2025;  // Using 2025 for testing
const currentMonth = currentDate.getMonth();

const mockTrackingData = {
  [`${currentYear}-05-20`]: { gym: true, diet: true },   // Green - both completed
  [`${currentYear}-05-21`]: { gym: true, diet: false },  // Yellow - gym done, diet skipped
  [`${currentYear}-05-22`]: { gym: false, diet: true },  // Blue - gym skipped, diet done
  [`${currentYear}-05-23`]: { gym: false, diet: false }, // Red - both skipped
  [`${currentYear}-05-24`]: { gym: true, diet: true },   // Green - both completed
  [`${currentYear}-05-19`]: { gym: true, diet: false },  // Yellow - gym done, diet skipped
  [`${currentYear}-05-18`]: { gym: false, diet: false }, // Red - both skipped
  [`${currentYear}-05-17`]: { gym: true, diet: true },   // Green - both completed
};

const Index = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [showDetail, setShowDetail] = useState(false);

  // Calculate overall statistics for the top bar
  const calculateStats = () => {
    const totalDays = Object.keys(mockTrackingData).length;
    const gymDays = Object.values(mockTrackingData).filter(day => day.gym).length;
    const dietDays = Object.values(mockTrackingData).filter(day => day.diet).length;
    const perfectDays = Object.values(mockTrackingData).filter(day => day.gym && day.diet).length;
    const gymNoDietDays = Object.values(mockTrackingData).filter(day => day.gym && !day.diet).length;
    
    return {
      totalDays,
      gymDays,
      dietDays,
      perfectDays,
      gymNoDietDays
    };
  };
  
  // Function to determine the day color in the calendar
  const getDayClassName = (date: Date | undefined) => {
    if (!date) return "";
    
    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    const dayData = mockTrackingData[dateString];
    
    if (!dayData) return "";
    
    // Color coding based on your specifications
    if (dayData.gym && dayData.diet) return "bg-green-200"; // Both completed - Green
    if (!dayData.gym && !dayData.diet) return "bg-red-200"; // Both skipped - Red
    if (dayData.gym && !dayData.diet) return "bg-yellow-200"; // Gym done, diet skipped - Yellow
    if (!dayData.gym && dayData.diet) return "bg-blue-200"; // Gym skipped, diet done - Blue
    
    return "";
  };

  const handleDayClick = (date: Date | undefined) => {
    setSelectedDate(date);
    
    const dateStr = date?.toISOString().split('T')[0];
    if (date && mockTrackingData[dateStr]) {
      setShowDetail(true);
    } else if (date) {
      toast({
        title: "No data",
        description: "No tracking data for this date yet.",
      });
      setShowDetail(false);
    }
  };

  // Define modifiers for the calendar days
  const modifiers = {
    greenDay: (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      const dayData = mockTrackingData[dateString];
      return !!(dayData && dayData.gym && dayData.diet);
    },
    redDay: (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      const dayData = mockTrackingData[dateString];
      return !!(dayData && !dayData.gym && !dayData.diet);
    },
    yellowDay: (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      const dayData = mockTrackingData[dateString];
      return !!(dayData && dayData.gym && !dayData.diet);
    },
    blueDay: (date: Date) => {
      const dateString = date.toISOString().split('T')[0];
      const dayData = mockTrackingData[dateString];
      return !!(dayData && !dayData.gym && dayData.diet);
    }
  };

  // Define class names for the modifiers
  const modifiersClassNames = {
    greenDay: "bg-green-200 text-green-800 font-bold",
    redDay: "bg-red-200 text-red-800 font-bold",
    yellowDay: "bg-yellow-200 text-yellow-800 font-bold",
    blueDay: "bg-blue-200 text-blue-800 font-bold"
  };

  // For easier testing, set the default view month to match our mock data
  const defaultMonth = new Date(currentYear, 4); // May is month index 4

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Stats Bar at the top */}
      <StatsBar stats={calculateStats()} />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left column - Calendar */}
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
        
        {/* Right column - Daily details or statistics */}
        <Card>
          <CardHeader>
            <CardTitle>
              {showDetail && selectedDate 
                ? `Details for ${selectedDate.toLocaleDateString()}`
                : "Today's Plan"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showDetail && selectedDate ? (
              <DayDetail 
                date={selectedDate} 
                data={mockTrackingData[selectedDate.toISOString().split('T')[0]]} 
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

export default Index;

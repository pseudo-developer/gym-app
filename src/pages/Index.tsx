
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsBar from "@/components/StatsBar";
import DayDetail from "@/components/DayDetail";
import { useToast } from "@/components/ui/use-toast";
import { ChevronDown } from "lucide-react";

// For now, we'll use mock data that we'll later replace with Firebase
const mockTrackingData = {
  "2023-05-01": { gym: true, diet: true },
  "2023-05-02": { gym: true, diet: false },
  "2023-05-03": { gym: false, diet: false },
  "2023-05-04": { gym: true, diet: true },
  "2023-05-05": { gym: false, diet: true },
  "2023-05-10": { gym: true, diet: true },
  "2023-05-15": { gym: false, diet: false },
  "2023-05-20": { gym: true, diet: false },
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
              modifiers={{
                customStyles: (date) => getDayClassName(date) !== "",
              }}
              modifiersClassNames={{
                customStyles: (date) => getDayClassName(date),
              }}
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


import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, TrendingUp } from "lucide-react";

interface StatsProps {
  stats: {
    totalDays: number;
    gymDays: number;
    dietDays: number;
    perfectDays: number;
    gymNoDietDays: number;
  }
}

const StatsBar = ({ stats }: StatsProps) => {
  const [selectedStat, setSelectedStat] = useState<string>("Total Days Tracked");

  const getSelectedStatValue = () => {
    switch(selectedStat) {
      case "Total Days Tracked":
        return stats.totalDays;
      case "Total Gym Days":
        return stats.gymDays;
      case "Total Diet Days":
        return stats.dietDays;
      case "Perfect Days (Both)":
        return stats.perfectDays;
      case "Gym without Diet":
        return stats.gymNoDietDays;
      default:
        return stats.totalDays;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 text-white rounded-full">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Gym Days</h3>
              <p className="text-2xl font-bold">{stats.gymDays}</p>
            </div>
          </div>
          
          <div className="h-12 border-r border-gray-200 hidden md:block" />
          
          <div className="flex items-center gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Days Tracked</h3>
              <p className="text-2xl font-bold">{stats.totalDays}</p>
            </div>
          </div>
          
          <div className="h-12 border-r border-gray-200 hidden md:block" />
          
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  {selectedStat}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStat("Total Days Tracked")}>
                  Total Days Tracked
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Total Gym Days")}>
                  Total Gym Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Total Diet Days")}>
                  Total Diet Days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Perfect Days (Both)")}>
                  Perfect Days (Both)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Gym without Diet")}>
                  Gym without Diet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="mt-2 text-2xl font-bold text-center md:text-left">{getSelectedStatValue()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsBar;

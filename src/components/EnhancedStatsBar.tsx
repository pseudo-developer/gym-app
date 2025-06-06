
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, TrendingUp, Target, Zap } from "lucide-react";

interface EnhancedStatsProps {
  stats: {
    totalDays: number;
    gymDays: number;
    dietDays: number;
    perfectDays: number;
    gymNoDietDays: number;
    gymSuccessRate: number;
    dietSuccessRate: number;
    perfectDayRate: number;
    currentGymStreak: number;
    currentDietStreak: number;
    currentPerfectStreak: number;
  }
}

const EnhancedStatsBar = ({ stats }: EnhancedStatsProps) => {
  const [selectedStat, setSelectedStat] = useState<string>("Gym Success Rate");

  const getSelectedStatValue = () => {
    switch(selectedStat) {
      case "Gym Success Rate":
        return `${stats.gymSuccessRate}%`;
      case "Diet Success Rate":
        return `${stats.dietSuccessRate}%`;
      case "Perfect Day Rate":
        return `${stats.perfectDayRate}%`;
      case "Current Gym Streak":
        return `${stats.currentGymStreak} days`;
      case "Current Diet Streak":
        return `${stats.currentDietStreak} days`;
      case "Current Perfect Streak":
        return `${stats.currentPerfectStreak} days`;
      default:
        return `${stats.gymSuccessRate}%`;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Gym Days */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 text-white rounded-full">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Gym Days</h3>
              <p className="text-xl font-bold">{stats.gymDays}</p>
              <p className="text-xs text-gray-500">{stats.gymSuccessRate}% success</p>
            </div>
          </div>
          
          {/* Total Diet Days */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 text-white rounded-full">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Diet Days</h3>
              <p className="text-xl font-bold">{stats.dietDays}</p>
              <p className="text-xs text-gray-500">{stats.dietSuccessRate}% success</p>
            </div>
          </div>
          
          {/* Perfect Days */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500 text-white rounded-full">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Perfect Days</h3>
              <p className="text-xl font-bold">{stats.perfectDays}</p>
              <p className="text-xs text-gray-500">{stats.perfectDayRate}% rate</p>
            </div>
          </div>
          
          {/* Dynamic Stat Selector */}
          <div className="flex flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full">
                  {selectedStat}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSelectedStat("Gym Success Rate")}>
                  Gym Success Rate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Diet Success Rate")}>
                  Diet Success Rate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Perfect Day Rate")}>
                  Perfect Day Rate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Current Gym Streak")}>
                  Current Gym Streak
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Current Diet Streak")}>
                  Current Diet Streak
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedStat("Current Perfect Streak")}>
                  Current Perfect Streak
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <p className="mt-2 text-xl font-bold text-center">{getSelectedStatValue()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedStatsBar;


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface HeaderProps {
  username: string;
  isGuest: boolean;
  trackFromDate: string;
  onTrackFromDateChange: (date: string) => void;
  onLogout: () => void;
}

const Header = ({ username, isGuest, trackFromDate, onTrackFromDateChange, onLogout }: HeaderProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Gym & Diet Tracker</h1>
            <p className="text-gray-600">
              Welcome, {username}! {isGuest && "(Guest Mode)"}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="trackFrom" className="text-sm whitespace-nowrap">
                Track from:
              </Label>
              <Input
                id="trackFrom"
                type="date"
                value={trackFromDate}
                onChange={(e) => onTrackFromDateChange(e.target.value)}
                className="w-auto"
              />
            </div>
            
            <Button variant="outline" onClick={onLogout}>
              {isGuest ? "Exit Guest Mode" : "Logout"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Header;

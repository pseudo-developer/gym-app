
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  CircleCheck, 
  CircleX 
} from "lucide-react";

interface DayDetailProps {
  date: Date;
  data?: {
    gym: boolean;
    diet: boolean;
    gymNotes?: string;
    dietNotes?: string;
  };
  onSave?: (data: { gym: boolean; diet: boolean; gymNotes?: string; dietNotes?: string }) => void;
}

const DayDetail = ({ date, data, onSave }: DayDetailProps) => {
  const [gymDone, setGymDone] = useState(data?.gym || false);
  const [dietDone, setDietDone] = useState(data?.diet || false);
  const [gymNotes, setGymNotes] = useState(data?.gymNotes || "");
  const [dietNotes, setDietNotes] = useState(data?.dietNotes || "");
  const [isEditing, setIsEditing] = useState(!data);

  const handleSave = () => {
    const newData = {
      gym: gymDone,
      diet: dietDone,
      gymNotes: gymNotes.trim() || undefined,
      dietNotes: dietNotes.trim() || undefined,
    };
    
    if (onSave) {
      onSave(newData);
    }
    setIsEditing(false);
  };

  const getStatusColor = () => {
    if (gymDone && dietDone) return "text-green-500";
    if (!gymDone && !dietDone) return "text-red-500";
    return "text-yellow-500";
  };

  const getStatusText = () => {
    if (gymDone && dietDone) return "Perfect day!";
    if (!gymDone && !dietDone) return "Both gym and diet skipped";
    if (gymDone) return "Gym completed, diet skipped";
    return "Diet maintained, gym skipped";
  };

  return (
    <div className="space-y-4">
      <div className={`text-center py-2 rounded-md ${getStatusColor()} bg-opacity-10`}>
        <p className="font-medium">{getStatusText()}</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg">Gym</h3>
            <div className="flex items-center mt-1">
              {gymDone ? (
                <CircleCheck className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <CircleX className="h-5 w-5 mr-2 text-red-500" />
              )}
              <span>{gymDone ? "Completed" : "Skipped"}</span>
            </div>
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Mark as Done</span>
              <Switch 
                checked={gymDone}
                onCheckedChange={setGymDone}
              />
            </div>
          )}
        </div>
        
        {(isEditing || gymNotes) && (
          <div className="pl-7">
            <p className="text-sm text-gray-500 mb-1">Notes:</p>
            {isEditing ? (
              <Textarea 
                placeholder="Add notes about your gym session..."
                value={gymNotes}
                onChange={(e) => setGymNotes(e.target.value)}
                rows={2}
                className="text-sm"
              />
            ) : (
              <p className="text-sm">{gymNotes || "No notes added"}</p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-lg">Diet</h3>
            <div className="flex items-center mt-1">
              {dietDone ? (
                <CircleCheck className="h-5 w-5 mr-2 text-green-500" />
              ) : (
                <CircleX className="h-5 w-5 mr-2 text-red-500" />
              )}
              <span>{dietDone ? "Maintained" : "Not Maintained"}</span>
            </div>
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Mark as Maintained</span>
              <Switch 
                checked={dietDone}
                onCheckedChange={setDietDone}
              />
            </div>
          )}
        </div>
        
        {(isEditing || dietNotes) && (
          <div className="pl-7">
            <p className="text-sm text-gray-500 mb-1">Notes:</p>
            {isEditing ? (
              <Textarea 
                placeholder="Add notes about your diet..."
                value={dietNotes}
                onChange={(e) => setDietNotes(e.target.value)}
                rows={2}
                className="text-sm"
              />
            ) : (
              <p className="text-sm">{dietNotes || "No notes added"}</p>
            )}
          </div>
        )}
      </div>

      {isEditing && (
        <div className="flex justify-end gap-2 pt-2">
          {data && (
            <Button 
              variant="outline" 
              onClick={() => {
                setGymDone(data.gym);
                setDietDone(data.diet);
                setGymNotes(data.gymNotes || "");
                setDietNotes(data.dietNotes || "");
                setIsEditing(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      )}
      
      {!isEditing && (
        <div className="flex justify-end pt-2">
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default DayDetail;

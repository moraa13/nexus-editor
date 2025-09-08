import { useState } from "react";
import Button from "../notus/Button";
import { Input, Textarea } from "../notus/Form";

export default function PropertiesPanel() {
  const [activeId, setActiveId] = useState<string>("");
  const [meta, setMeta] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // TODO: Save to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 h-full">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xl">⚙️</span>
        <h2 className="text-lg font-semibold text-white">Properties</h2>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Node ID</label>
          <Input 
            value={activeId} 
            onChange={(e) => setActiveId(e.target.value)} 
            placeholder="Select a node to edit properties"
            className="bg-gray-800 border-gray-600 text-white"
            disabled={!isEditing}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Metadata</label>
          <Textarea 
            className="min-h-[200px] bg-gray-800 border-gray-600 text-white" 
            placeholder="Enter metadata as key: value pairs"
            value={Object.entries(meta).map(([k,v]) => `${k}: ${v}`).join("\n")} 
            onChange={() => {}} 
            disabled={!isEditing}
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex-1"
            >
              Edit Properties
            </Button>
          ) : (
            <>
              <Button 
                onClick={handleSave}
                variant="success"
                className="flex-1"
              >
                Save
              </Button>
              <Button 
                onClick={handleCancel}
                variant="ghost"
                className="flex-1"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}



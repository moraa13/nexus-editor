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
    <div className="h-full bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-lg">⚙️</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Properties</h2>
            <p className="text-xs text-gray-400">Edit selected element properties</p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 space-y-6 overflow-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Element ID</label>
            <Input 
              value={activeId} 
              onChange={(e) => setActiveId(e.target.value)} 
              placeholder="Select an element to edit properties"
              className="bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20"
              disabled={!isEditing}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Metadata</label>
            <Textarea 
              className="min-h-[200px] bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500/20" 
              placeholder="Enter metadata as key: value pairs&#10;Example:&#10;type: dialogue_node&#10;speaker: protagonist&#10;emotion: neutral"
              value={Object.entries(meta).map(([k,v]) => `${k}: ${v}`).join("\n")} 
              onChange={() => {}} 
              disabled={!isEditing}
            />
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/10">
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Properties
            </Button>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </Button>
              <Button 
                onClick={handleCancel}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-3 rounded-lg transition-all duration-200 border border-white/20"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



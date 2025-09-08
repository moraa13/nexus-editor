import EditorLayout from "../../layouts/EditorLayout";
import Sidebar from "./Sidebar";
import Canvas from "./Canvas";
import PropertiesPanel from "./PropertiesPanel";
import BottomPanel from "./BottomPanel";
import DialogueGenerator from "../DialogueGenerator";

export default function Editor() {
  return (
    <EditorLayout
      sidebar={<Sidebar />}
      main={
        <div className="h-full grid grid-rows-[1fr_auto]">
          <Canvas />
          <div className="border-t border-slate-700"><DialogueGenerator /></div>
        </div>
      }
      right={<PropertiesPanel />}
      bottom={<BottomPanel />}
    />
  );
}




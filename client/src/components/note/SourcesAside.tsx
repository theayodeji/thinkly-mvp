import { Plus } from "lucide-react";
import SourceList from "./SourceList";

type Props = {};

const SourcesAside = (props: Props) => {
  return (
    <aside className="lg:block">
      <div className="flex justify-between items-center mb-4">
        <h3 className=" text-lg font-semibold text-gray-800">Sources</h3>
        <button className="text-sm text-gray-600">
          <Plus className="text-white bg-gradient-primary cursor-pointer p-1 rounded-full"/>
        </button>
      </div>
      <SourceList />
    </aside>
  );
};

export default SourcesAside;

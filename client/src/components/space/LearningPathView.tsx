import React from "react";
import { useParams } from "react-router-dom";
import { useLearningPaths, LearningPathNode } from "../../hooks/queries/useLearningPath";
import { Loader2, MapPinPen } from "lucide-react";
import { motion } from "framer-motion";

const LearningPathView = () => {
  const { id } = useParams<{ id: string }>();
  const { data: learningPaths, isLoading } = useLearningPaths(id || "");
  const [selectedPathId, setSelectedPathId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <p className="text-text-secondary text-sm">Loading your learning paths...</p>
      </div>
    );
  }

  if (!learningPaths || learningPaths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 text-center px-4">
        <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <MapPinPen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="font-semibold text-text">No Learning Paths Yet</h3>
          <p className="text-sm text-text-secondary mt-1">
            Generate a learning path from the quick tools menu.
          </p>
        </div>
      </div>
    );
  }

  const activePath = selectedPathId 
    ? learningPaths.find(p => p._id === selectedPathId) || learningPaths[0]
    : learningPaths[0];

  return (
    <div className="p-2 md:p-6 max-w-5xl mx-auto w-full relative">
      {learningPaths.length > 1 && (
        <div className="flex justify-center mb-8 relative z-50">
          <select 
            value={activePath._id} 
            onChange={(e) => setSelectedPathId(e.target.value)}
            className="glass-panel border-border/50 rounded-xl px-4 py-2 text-sm font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer shadow-sm appearance-none pr-8 bg-no-repeat"
            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke-width=\'2\' stroke=\'currentColor\' class=\'w-4 h-4\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' d=\'m19.5 8.25-7.5 7.5-7.5-7.5\' /%3E%3C/svg%3E")', backgroundPosition: 'right 0.75rem center', backgroundSize: '1rem' }}
          >
            {learningPaths.map((path, idx) => (
              <option key={path._id} value={path._id} className="bg-bg text-text">
                {path.topic} {idx === 0 ? "(Newest)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="text-center mb-16">
        <h2 className="text-2xl font-bold text-text mb-2 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          {activePath.topic}
        </h2>
        <p className="text-sm text-text-secondary">Follow this roadmap to master the topic</p>
      </div>

      <div className="relative w-full">
        {/* Center vertical spine */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400/50 via-primary-500/50 to-primary-600/50 transform -translate-x-1/2 rounded-full hidden md:block z-0"></div>

        <div className="flex flex-col gap-24 md:gap-16">
          {activePath.nodes.map((node: LearningPathNode, index: number) => {
            const isLeft = index % 2 === 0;

            const difficultyColors = {
              beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-400",
              intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-400",
              advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400 border-rose-400",
            };

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                key={node.id}
                className="relative flex flex-col md:flex-row w-full items-center min-h-[120px] z-10"
              >
                {/* Mobile: Draw a vertical line just for the mobile layout since the center one is hidden */}
                <div className="absolute left-6 top-10 bottom-[-6rem] w-1 bg-gradient-to-b from-primary-400/50 to-primary-600/50 rounded-full md:hidden -z-10"></div>

                {/* Left Side Sub-topics (Desktop Only) */}
                <div className="hidden md:flex flex-1 flex-col items-end justify-center pr-8 gap-3 relative">
                  {isLeft && node.topicsCovered.map((topic, i) => (
                    <div key={i} className="relative z-10 bg-bg-secondary dark:bg-slate-800 px-4 py-2 text-sm rounded-lg shadow-sm border-2 border-border/50 text-text max-w-[220px] text-center hover:border-primary-400 transition-colors">
                      {topic}
                      {/* Connector Line */}
                      <div className="absolute top-1/2 -right-8 w-8 border-t-2 border-dotted border-primary-500/50 -z-10"></div>
                    </div>
                  ))}
                </div>

                {/* Center Main Node */}
                <div className="relative z-20 w-full md:w-64 shrink-0 flex flex-col items-center px-4 md:px-0">
                  <div className={`w-full glass-panel p-4 text-center rounded-xl border-2 shadow-xl hover:-translate-y-1 transition-transform cursor-default ${difficultyColors[node.difficulty]}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 opacity-70">
                      {node.difficulty}
                    </span>
                    <h4 className="font-bold text-lg leading-tight">
                      {node.title}
                    </h4>
                  </div>

                  {/* Mobile Sub-topics (rendered directly below the main node on small screens) */}
                  <div className="flex md:hidden flex-col gap-2 w-full pl-12 mt-4 relative">
                    {node.topicsCovered.map((topic, i) => (
                      <div key={i} className="relative z-10 bg-bg-secondary dark:bg-slate-800 px-3 py-2 text-sm rounded-lg border-2 border-border/50 text-text text-left">
                        {topic}
                        <div className="absolute top-1/2 -left-8 w-8 border-t-2 border-dotted border-primary-500/50 -z-10"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side Sub-topics (Desktop Only) */}
                <div className="hidden md:flex flex-1 flex-col items-start justify-center pl-8 gap-3 relative">
                  {!isLeft && node.topicsCovered.map((topic, i) => (
                    <div key={i} className="relative z-10 bg-bg-secondary dark:bg-slate-800 px-4 py-2 text-sm rounded-lg shadow-sm border-2 border-border/50 text-text max-w-[220px] text-center hover:border-primary-400 transition-colors">
                      {topic}
                      {/* Connector Line */}
                      <div className="absolute top-1/2 -left-8 w-8 border-t-2 border-dotted border-primary-500/50 -z-10"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningPathView;

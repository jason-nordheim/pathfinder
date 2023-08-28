import { FC } from "react";
import { useDrag } from "react-dnd";

type GraphNodeProps = {
  id: string;
  selected?: boolean;
  onClick: (id: string) => void;
};

export const GraphNode: FC<GraphNodeProps> = ({ id, selected, onClick }) => {
  const [, drag] = useDrag({
    type: "NODE",
    item: { id },
  });

  return (
    <div ref={drag} className={`node ${selected ? "selected" : ""}`} onClick={() => onClick(id)}>
      {id}
    </div>
  );
};

export default GraphNode;

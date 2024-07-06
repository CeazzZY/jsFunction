import { Row } from "./row";
import VariableSizeList from "./variableSizeList";

export default function Index() {
  const minSize = 25;
  const addSize = 50;
  const rowSizes = new Array(1000)
    .fill(true)
    .map(() => minSize + Math.floor(Math.random() * addSize));

  const getItemSize = (index: number) => rowSizes[index];

  return (
    <VariableSizeList
      height={200}
      width={200}
      itemEstimatedSize={minSize + addSize / 2}
      itemCount={1000}
      itemSize={getItemSize}
    >
      {Row}
    </VariableSizeList>
  );
}

import { Row } from "./row";
import FixedSizeList from "./fixedSizeList";

export default function Index() {
  return (
    <FixedSizeList height={600} width={500} itemSize={50} itemCount={2000}>
      {Row}
    </FixedSizeList>
  );
}

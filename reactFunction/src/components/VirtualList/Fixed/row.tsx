import { CSSProperties } from "react";
import "./row.css";

interface IProps {
  index: number;
  style: CSSProperties;
}
export const Row = ({ index, style }: IProps) => {
  return (
    <div
      className={index % 2 ? "list-item-odd" : "list-item-even"}
      style={style}
    >
      {`Row ${index}`}
    </div>
  );
};

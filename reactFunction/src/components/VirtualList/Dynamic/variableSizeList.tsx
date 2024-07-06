import { CSSProperties, ElementType, useState } from "react";

// 元数据
const measuredData = {
  measuredDataMap: {} as Record<string, { offset: number; size: number }>,
  LastMeasuredItemIndex: -1,
};

const estimatedHeight = (
  defaultEstimatedItemSize: number,
  itemCount: number
) => {
  let measuredHeight = 0;
  const { measuredDataMap, LastMeasuredItemIndex } = measuredData;
  // 计算已经获取过真实高度的项的高度之和
  if (LastMeasuredItemIndex >= 0) {
    const lastMeasuredItem = measuredDataMap[LastMeasuredItemIndex];
    measuredHeight = lastMeasuredItem.offset + lastMeasuredItem.size;
  }
  // 未计算过真实高度的项数
  const unMeasuredItemsCount =
    itemCount - measuredData.LastMeasuredItemIndex - 1;
  // 预测总高度
  const totalEstimatedHeight =
    measuredHeight + unMeasuredItemsCount * defaultEstimatedItemSize;
  return totalEstimatedHeight;
};

const getItemMetaData = (props: IProps, index: number) => {
  const { itemSize } = props;
  const { measuredDataMap, LastMeasuredItemIndex } = measuredData;
  // 如果当前索引比已记录的索引要大，说明要计算当前索引的项的size和offset
  if (index > LastMeasuredItemIndex) {
    let offset = 0;
    // 计算当前能计算出来的最大offset值
    if (LastMeasuredItemIndex >= 0) {
      const lastMeasuredItem = measuredDataMap[LastMeasuredItemIndex];
      offset += lastMeasuredItem.offset + lastMeasuredItem.size;
    }
    // 计算直到index为止，所有未计算过的项
    for (let i = LastMeasuredItemIndex + 1; i <= index; i++) {
      const currentItemSize = itemSize(i);
      measuredDataMap[i] = { size: currentItemSize, offset };
      offset += currentItemSize;
    }
    // 更新已计算的项的索引值
    measuredData.LastMeasuredItemIndex = index;
  }
  return measuredDataMap[index];
};

const getStartIndex = (props: IProps, scrollOffset: number) => {
  const { itemCount } = props;
  let index = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const currentOffset = getItemMetaData(props, index).offset;
    if (currentOffset >= scrollOffset) return index;
    if (index >= itemCount) return itemCount;
    index++;
  }
};

const getEndIndex = (props: IProps, startIndex: number) => {
  const { height, itemCount } = props;
  // 获取可视区内开始的项
  const startItem = getItemMetaData(props, startIndex);
  // 可视区内最大的offset值
  const maxOffset = startItem.offset + height;
  // 开始项的下一项的offset，之后不断累加此offset，直到等于或超过最大offset，就是找到结束索引了
  let offset = startItem.offset + startItem.size;
  // 结束索引
  let endIndex = startIndex;
  // 累加offset
  while (offset <= maxOffset && endIndex < itemCount - 1) {
    endIndex++;
    const currentItem = getItemMetaData(props, endIndex);
    offset += currentItem.size;
  }
  return endIndex;
};

const getRangeToRender = (props: IProps, scrollOffset: number) => {
  const { itemCount } = props;
  const startIndex = getStartIndex(props, scrollOffset);
  const endIndex = getEndIndex(props, startIndex);
  return [
    Math.max(0, startIndex - 2),
    Math.min(itemCount - 1, endIndex + 2),
    startIndex,
    endIndex,
  ];
};

interface IProps {
  height: number;
  width: number;
  itemCount: number;
  itemEstimatedSize: number;
  children: ElementType;
  itemSize: (index: number) => number;
}

const VariableSizeList = (props: IProps) => {
  const {
    height,
    width,
    itemCount,
    itemEstimatedSize,
    children: Child,
  } = props;
  const [scrollOffset, setScrollOffset] = useState(0);

  const containerStyle: CSSProperties = {
    position: "relative",
    width,
    height,
    overflow: "auto",
    willChange: "transform",
  };

  const contentStyle = {
    height: estimatedHeight(itemEstimatedSize, itemCount),
    width: "100%",
  };

  const getCurrentChildren = () => {
    const [startIndex, endIndex] = getRangeToRender(props, scrollOffset);
    const items = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const item = getItemMetaData(props, i);
      const itemStyle = {
        position: "absolute",
        height: item.size,
        width: "100%",
        top: item.offset,
      };
      items.push(<Child key={i} index={i} style={itemStyle} />);
    }
    return items;
  };

  const scrollHandle = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop } = event.currentTarget;
    setScrollOffset(scrollTop);
  };

  return (
    <div style={containerStyle} onScroll={scrollHandle}>
      <div style={contentStyle}>{getCurrentChildren()}</div>
    </div>
  );
};

export default VariableSizeList;

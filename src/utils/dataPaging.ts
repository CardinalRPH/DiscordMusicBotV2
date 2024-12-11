import { QueueItem } from "../AudioFunction/queueManager";
import { MAX_QUEUE_OUTPUT } from "./constant";

const getDataPaging = (data: QueueItem[], page = 1) => {
  const offset = page > 1 ? MAX_QUEUE_OUTPUT * (page - 1) : 0;
  const totalPage = Math.ceil(data.length / MAX_QUEUE_OUTPUT);
  const optimal = data.slice(offset, offset + MAX_QUEUE_OUTPUT);
  return {
    nextPage: page >= totalPage ? null : page + 1,
    prevPage: page <= 1 ? null : page > totalPage ? null : page - 1,
    currentPage: page <= 1 ? 1 : page > totalPage ? totalPage : page,
    totalRow: data.length,
    totalPage: totalPage,
    optimizeData: optimal,
  };
};

export default getDataPaging;

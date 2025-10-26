import HomeChart from "../HomeChart";
import { useCoinContext } from "@/app/hooks/useCoinContext";
const ChartContainer = () => {
  const { showComparison } = useCoinContext();

  return <div>{!showComparison && <HomeChart />}</div>;
};
export default ChartContainer;

import { CoinDataContext } from "@/app/context/coinDataContext";
import { useContext } from "react";
import { CoinContextType } from "@/interfaces/CoinContextType";

export function useCoinContext(): CoinContextType {
  const context = useContext(CoinDataContext);
  if (!context) {
    throw new Error("useCoinContext must be used within a CoinDataProvider");
  }
  return context;
}

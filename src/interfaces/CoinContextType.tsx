import { ReactElement } from "react";
import { Coin } from "./Coininterface";

export interface CoinContextType {
  coinData: Coin[];
  fetchMoreData: () => void;
  hasMore: boolean;
  showConvertor: boolean;
  setShowConvertor: (val: boolean) => void;
  showComparison: boolean;
  setShowComparison: (val: boolean) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
  debouncedCurrency: string;
  currencySymbol: ReactElement;
  setCurrencySymbol: (symbol: ReactElement) => void;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

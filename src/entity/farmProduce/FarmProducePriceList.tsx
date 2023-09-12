export interface FarmProducePriceList {
  farmProduceName: string;
  priceList: { [date: string]: number }[];
}

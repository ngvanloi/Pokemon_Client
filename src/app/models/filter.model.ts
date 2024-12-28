export interface IFilter {
    limit: number;
    page: number;
    sort: string | undefined;
    type: string | undefined;
    isLegendary: boolean;
    speedRange: number;
    searchName: string | undefined;
  }
  
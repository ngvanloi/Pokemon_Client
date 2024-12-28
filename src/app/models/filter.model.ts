export interface IFilter {
    limit: number;
    page: number;
    sort: string | undefined;
    type: string | undefined;
    isLegendary: boolean;
    minSpeed: number;
    maxSpeed: number;
    searchName: string | undefined;
  }
  
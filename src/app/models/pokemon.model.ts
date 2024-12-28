
export interface IPokemon {
    _id?:string;
    name: string;
    type1: string;
    type2?: string;
    total: number;
    hp: number;
    attack?: number;
    defense?: number;
    spAttack?: number;
    spDefense?: number;
    speed?: number;
    generation?: number;
    legendary?: boolean;
    image: string;
    ytbUrl?: string;
    isFavorite?: boolean;
}
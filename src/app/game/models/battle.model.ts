export namespace Battle {

  export interface Player{
    name?: string;
    characterName?: string;
    height?: number;
    mass?: number;
    vehicleName?: string;
    vehicleCrew?: number;
  }

  export interface State {
    players: Player[];
    winner?: Player | null;
  }

  export type History = State[];

  export type CharacterAttributes = Pick<Player, 'characterName' | 'height' | 'mass'>;
  export type VehicleAttributes = Pick<Player, 'vehicleName' | 'vehicleCrew'>;
  export type PlayerAttributes = CharacterAttributes | VehicleAttributes;
}

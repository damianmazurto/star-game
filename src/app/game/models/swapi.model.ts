export namespace Swapi {
  export interface Response {
    message: string;
    result: {
      description: string;
      properties: Character | Starship;
      uid: string;
    };
  }

  export interface Character {
    name: string;
    height: string;
    mass: string;
  }

  export interface Starship {
    name: string;
    model: string;
    crew: string;
  }

}

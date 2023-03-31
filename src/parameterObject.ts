export interface GameMainParameterObject extends g.GameMainParameterObject {
  sessionParameter: {
    mode?: string;
    totalTimeLimit?: number;
    difficulty?: number;
    randomSeed?: number;
    debug?: boolean;
  };
  isAtsumaru: boolean;
  random: g.RandomGenerator;
}

export interface RPGAtsumaruWindow {
  RPGAtsumaru?: any;
}

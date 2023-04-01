export type DebugOption = {
  rotate: boolean,
  grid: boolean
}

export interface GameMainParameterObject extends g.GameMainParameterObject {
  sessionParameter: {
    mode?: string;
    totalTimeLimit?: number;
    difficulty?: number;
    randomSeed?: number;
    debug?: DebugOption;
  };
  isAtsumaru: boolean;
  random: g.RandomGenerator;
}

export interface RPGAtsumaruWindow {
  RPGAtsumaru?: any;
}

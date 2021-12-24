import { data, testData } from "./inputData";
import { sum } from "../util";

type GameState = {
  universes: number;
  active: boolean;
  playerTurn: number;
  playerPos: number[];
  playerScore: number[];
};

const getStateKey = (
  playerTurn: number,
  player0Pos: number,
  player1Pos: number,
  player0Score: number,
  player1Score: number
): string => {
  return `${playerTurn},${player0Pos},${player1Pos},${player0Score},${player1Score}`;
};

type GameStateMap = Record<string, GameState>;

type DiracRoll = {
  result: number;
  universes: number;
};

describe("day 21", () => {
  const playerPos: number[] = [];
  const playerScore: number[] = [];
  let turn = 0;
  let dice = 0;

  const gameStateMap: GameStateMap = {};
  const diracRolls: DiracRoll[] = [];

  const getActiveGameState = (): GameState | undefined => {
    let gameState: GameState | undefined = undefined;
    Object.values(gameStateMap).forEach((gs) => {
      if (
        gs.active &&
        (!gameState ||
          gs.playerScore[gs.playerTurn] <
            gameState.playerScore[gameState.playerTurn])
      ) {
        gameState = gs;
      }
    });
    return gameState;
  };

  const roll = () => {
    dice = (dice % 100) + 1;
    return dice;
  };

  beforeAll(() => {
    data.split("\n").forEach((row) => {
      const tmp = row.split(" ");
      playerPos.push(+tmp[tmp.length - 1]);
      playerScore.push(0);
    });

    gameStateMap[getStateKey(0, playerPos[0], playerPos[1], 0, 0)] = {
      active: true,
      playerTurn: 0,
      universes: 1,
      playerPos: [playerPos[0], playerPos[1]],
      playerScore: [0, 0],
    };

    const tmpRolls = [1, 2, 3];
    tmpRolls.forEach((roll1) => {
      tmpRolls.forEach((roll2) => {
        tmpRolls.forEach((roll3) => {
          const total = roll1 + roll2 + roll3;
          const dRoll = diracRolls.find((roll) => roll.result === total);
          if (!dRoll) {
            diracRolls.push({ result: total, universes: 1 });
            return;
          }
          dRoll.universes++;
        });
      });
    });
  });

  it("1", () => {
    while (Math.max(...playerScore) < 1000) {
      const playerId = turn % playerScore.length;
      const rolls = [roll(), roll(), roll()];
      const move = sum(...rolls);
      playerPos[playerId] = ((playerPos[playerId] + move - 1) % 10) + 1;
      playerScore[playerId] += playerPos[playerId];
      turn++;
    }

    console.log("answer:", Math.min(...playerScore) * turn * 3);
  });

  it("2", () => {
    let active = getActiveGameState();
    while (active) {
      const activePlayer = active.playerTurn;
      const inactivePlayer = (active.playerTurn + 1) % 2;

      diracRolls.forEach((roll) => {
        const pos =
          ((active.playerPos[activePlayer] + roll.result - 1) % 10) + 1;
        const score = active.playerScore[activePlayer] + pos;
        const universes = active.universes * roll.universes;

        const key = getStateKey(
          inactivePlayer,
          pos,
          active.playerPos[inactivePlayer],
          score,
          active.playerScore[inactivePlayer]
        );
        const gameState = gameStateMap[key];

        if (gameState) {
          gameState.active = score < 21;
          gameState.universes += universes;
        } else {
          gameStateMap[key] = {
            active: score < 21,
            universes: universes,
            playerTurn: inactivePlayer,
            playerPos: [
              activePlayer ? active.playerPos[0] : pos,
              activePlayer ? pos : active.playerPos[1],
            ],
            playerScore: [
              activePlayer ? active.playerScore[0] : score,
              activePlayer ? score : active.playerScore[1],
            ],
          };
        }
      });

      active.universes = 0;
      active.active = false;
      active = getActiveGameState();
    }

    const playerWins = [0, 0];
    Object.values(gameStateMap)
      .filter((gameState) => gameState.universes > 0)
      .forEach((gameState) => {
        if (gameState.playerScore[0] >= 21) {
          playerWins[0] += gameState.universes;
        } else if (gameState.playerScore[1] >= 21) {
          playerWins[1] += gameState.universes;
        } else {
          console.log(gameState);
          throw new Error("found unfinished game");
        }
      });

    console.log("playerWins:", playerWins);
  });
});

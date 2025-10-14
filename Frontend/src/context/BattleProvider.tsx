import { useState, type ReactNode } from "react";
import { BattleContext } from ".";

const BattleProvider = ({ children }: { children: ReactNode }) => {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);
  const [xp, setXp] = useState(0);

  return (
    <BattleContext value={{ wins, setWins, losses, setLosses, xp, setXp }}>
      {children}
    </BattleContext>
  );
};

export default BattleProvider;

import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import bgBattle from "../assets/draw-a-pixel-pokemon-battle-background.png";
import bgBattleMusic from "../assets/1-01. Opening.mp3";
import { getPokemonById, getUserCardbyQuery, updateUserCard } from "@/data";
import { typeColor } from "@/utils";
import { usePokemon, useAuthor, useBattle } from "@/context";
import gifLoading from "../assets/Pika Sticker.gif";
import gifNoPokemon from "../assets/Happy Pokemon Sticker.gif";

const BattleScreen = () => {
  const [playerPokemon, setPlayerPokemon] = useState<Pokemon | null>(null);
  const [enemyPokemon, setEnemyPokemon] = useState<Pokemon | null>(null);
  const [playerHP, setPlayerHP] = useState(0);
  const [enemyHP, setEnemyHP] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [battleOver, setBattleOver] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const navigate = useNavigate();

  const [userCard, setUserCard] = useState<UserCard[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { pokemonId } = usePokemon();
  const { user } = useAuthor();
  const { wins, setWins, losses, setLosses, xp, setXp } = useBattle();

  // Carica utente e punteggi dal server

  useEffect(() => {
    (async () => {
      if (!user?._id) return;
      try {
        const data = await getUserCardbyQuery(user._id);
        setUserCard(data);

        console.log("UserCard loaded from DB:", data);
      } catch (err) {
        console.error("Error fetching userCard:", err);
      }
    })();
  }, []);

  const userCardId = userCard[0]?._id || ""; // ID della userCard per gli aggiornamenti
  // console.log("Current UserCard:", userCardId);

  // Carica Pokémon all'apertura
  useEffect(() => {
    async function loadBattlePokemons() {
      try {
        const playerId = pokemonId;
        const enemyId = Math.floor(Math.random() * 500) + 1;

        const [playerData, enemyData] = await Promise.all([
          getPokemonById(playerId!.toString()),
          getPokemonById(enemyId.toString()),
        ]);

        setPlayerPokemon(playerData);
        setEnemyPokemon(enemyData);

        setPlayerHP(getStat(playerData, "hp") * 3);
        setEnemyHP(getStat(enemyData, "hp") * 3);
      } catch (err) {
        console.error("Error loading Pokémon:", err);
      } finally {
        setLoading(false);
      }
    }

    loadBattlePokemons();
  }, [pokemonId]);

  const getStat = (pokemon: Pokemon, statName: string) =>
    pokemon.stats.find((s) => s.stat.name === statName)?.base_stat ?? 0;

  const handleTryAgain = async () => {
    if (!playerPokemon) return;

    setMessage("");
    setBattleOver(false);
    setBattleStarted(false);
    setPlayerHP(getStat(playerPokemon, "hp") * 3);

    try {
      const enemyId = Math.floor(Math.random() * 500) + 1;
      const enemyData = await getPokemonById(enemyId.toString());
      setEnemyPokemon(enemyData);
      setEnemyHP(getStat(enemyData, "hp") * 3);
      console.log("New enemy Pokémon loaded:", enemyData.name);
      console.log("Current stats (no DB update):", { wins, losses, xp });
    } catch (err) {
      console.error("Error loading new enemy Pokémon:", err);
    }
  };

  const handleBattle = async () => {
    if (!playerPokemon || !enemyPokemon || battleOver) return;

    if (!battleStarted && audioRef.current) {
      audioRef.current.volume = 0.2;
      audioRef.current.play();
      setBattleStarted(true);
    }

    const playerAttack = getStat(playerPokemon, "attack");
    const enemyAttack = getStat(enemyPokemon, "attack");

    const randomPlayerDamage = Math.floor(Math.random() * playerAttack) + 10;
    const randomEnemyDamage = Math.floor(Math.random() * enemyAttack) + 10;

    const newEnemyHP = Math.max(enemyHP - randomPlayerDamage, 0);
    const newPlayerHP = Math.max(playerHP - randomEnemyDamage, 0);

    setEnemyHP(newEnemyHP);
    setPlayerHP(newPlayerHP);

    if (newEnemyHP === 0 && newPlayerHP === 0) {
      setMessage("Both Pokémon fainted! It's a draw!");
      setBattleOver(true);
    } else if (newEnemyHP === 0) {
      setMessage(`${playerPokemon.name} wins! 🎉`);

      // Aggiorna stati prima di inviare
      const newWins = 1;
      const newXp = 400;
      setWins(newWins);
      setXp(newXp);

      const updatedUserCard = {
        userId: userCard[0].userId,
        pokemonId: pokemonId,
        score: { wins: newWins, losses: losses },
        points: newXp,
      };

      try {
        const res = await updateUserCard(userCardId, updatedUserCard);
        console.log("Database updated after win:", res);
      } catch (err) {
        console.error("Error updating userCard:", err);
      }

      setBattleOver(true);
    } else if (newPlayerHP === 0) {
      setMessage(`${enemyPokemon.name} wins! 💀`);

      const newLooses = 1;
      const newXp = 100;
      setLosses(newLooses);
      setXp(newXp);

      const updatedUserCard = {
        userId: userCard[0].userId,
        pokemonId: pokemonId,
        score: { wins: wins, losses: newLooses },
        points: newXp,
      };

      try {
        const res = await updateUserCard(userCardId, updatedUserCard);
        console.log("Database updated after loss:", res);
      } catch (err) {
        console.error("Error updating userCard:", err);
      }

      setBattleOver(true);
    } else {
      setMessage(
        `${playerPokemon.name} dealt ${randomPlayerDamage} damage! ${enemyPokemon.name} dealt ${randomEnemyDamage} damage!`
      );
    }
  };

  useEffect(() => {
    if (battleOver && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [battleOver]);
  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img src={gifLoading} alt="Pikachu running" className="w-40 h-auto" />
        <progress className="progress w-40 mt-10"></progress>
        <p className="text-xl font-semibold mt-4">Loading Battle...</p>
      </div>
    );

  const playerMaxHP = playerPokemon ? getStat(playerPokemon, "hp") * 3 : 1;
  const enemyMaxHP = enemyPokemon ? getStat(enemyPokemon, "hp") * 3 : 1;

  if (!pokemonId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h2 className="text-2xl font-bold">No Pokémon selected!</h2>
        <p className="text-center max-w-md">
          Please go back to the home screen and choose your Pokémon before
          starting the battle.
        </p>

        <div>
          <img className="max-w-[100%] h-[300px]" src={gifNoPokemon} alt="" />
        </div>

        <button
          onClick={() => navigate("/")} // <-- rimanda alla Home
          className="px-8 py-4 bg-yellow-400 hover:bg-white hover:text-black  text-black font-bold rounded-full border-2 border-black shadow-lg transition active:scale-95 cursor-pointer"
        >
          Choose Pokémon
        </button>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center w-full p-4 gap-4 pt-40">
      {/* Sfondo battaglia */}
      <div
        className="relative w-full max-w-[80%] h-[700px] rounded-2xl border-4 border-black bg-cover bg-center flex justify-between items-end overflow-hidden"
        style={{ backgroundImage: `url(${bgBattle})` }}
      >
        {/* HP nemico */}
        {enemyPokemon && (
          <div
            className="absolute"
            style={{ top: "8%", right: "10%", minWidth: 180 }}
          >
            <div className="bg-black/60 text-white rounded px-3 py-1 mb-2 text-sm font-semibold text-center shadow">
              {enemyPokemon.name.toUpperCase()} • {enemyHP} HP
            </div>
            <div className="w-44 bg-gray-300 h-3 rounded overflow-hidden shadow-inner">
              <div
                className="bg-red-500 h-3 rounded"
                style={{ width: `${(enemyHP / enemyMaxHP) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* HP giocatore */}
        {playerPokemon && (
          <div
            className="absolute"
            style={{ bottom: "8%", left: "10%", minWidth: 180 }}
          >
            <div className="bg-black/60 text-white rounded px-3 py-1 mb-2 text-sm font-semibold text-center shadow">
              {playerPokemon.name.toUpperCase()} • {playerHP} HP
            </div>
            <div className="w-44 bg-gray-300 h-3 rounded overflow-hidden shadow-inner">
              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Pokémon del giocatore */}
        {playerPokemon && (
          <img
            src={playerPokemon.sprites.back_default}
            alt={playerPokemon.name}
            className="w-56 ml-90 mb-20"
          />
        )}

        {/* Pokémon nemico */}
        {enemyPokemon && (
          <img
            src={enemyPokemon.sprites.front_default}
            alt={enemyPokemon.name}
            className="w-56 mr-80 mb-72"
          />
        )}

        {/* Messaggio centrale */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white/70 border-2 border-gray-800 rounded-xl px-6 py-3 text-center max-w-[70%]">
          <p className="text-lg font-semibold text-gray-900">
            {message || "Press Battle to start!"}
          </p>
        </div>
      </div>
      {/* Bottone Battle */}
      <button
        onClick={handleBattle}
        disabled={battleOver}
        className={`px-10 py-3 rounded-xl text-xl font-bold text-white shadow-md transition-transform active:scale-95 cursor-pointer ${
          battleOver
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        Battle!
      </button>

      {battleOver && (
        <div className="flex gap-4 mt-4">
          {/* Try Again */}
          <button
            onClick={handleTryAgain}
            className="px-4 py-2 rounded-[1rem] bg-green-400 border-2 border-gray-700 hover:bg-white  text-black font-semibold transition-transform transform hover:scale-95 cursor-pointer"
          >
            Try Again
          </button>

          {/* Scegli un altro Pokémon */}
          <button
            onClick={() => navigate("/")} // torna alla home
            className="px-10 py-5 rounded-[1rem] bg-yellow-400 border-2 border-gray-700 hover:bg-white  text-black font-semibold transition-transform transform hover:scale-95 cursor-pointer"
          >
            Choose Another Pokémon
          </button>
        </div>
      )}

      {/* Schede Pokémon */}
      <div className="flex w-full max-w-[1200px] justify-between gap-4 flex-wrap mt-4">
        {/* Player Card */}
        <div className="flex-1 backdrop-blur-sm p-4 rounded-2xl border-2 border-gray-800 shadow-lg min-w-[250px]">
          <h2 className="text-xl font-bold mb-2 text-center">Your Pokémon</h2>
          {playerPokemon && (
            <div className="text-center">
              <h3 className="capitalize text-lg font-semibold">
                {playerPokemon.name}
              </h3>
              <img
                src={playerPokemon.sprites.front_default}
                alt={playerPokemon.name}
                className="w-32 m-auto"
              />
              <div className="flex justify-center gap-2 mt-2">
                {playerPokemon.types.map((t, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: typeColor(t.type.name) }}
                  >
                    {t.type.name.toUpperCase()}
                  </span>
                ))}
              </div>
              {/* HP nella card */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>HP</span>
                  <span>{playerHP}</span>
                </div>
                <div className="w-full bg-gray-300 h-3 rounded">
                  <div
                    className="bg-green-500 h-3 rounded"
                    style={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                  />
                </div>
              </div>
              {/* Stats */}
              <div className="mt-4 space-y-2">
                {playerPokemon.stats.map((s) => (
                  <div key={s.stat.name}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="capitalize">
                        {s.stat.name.replace("-", " ")}
                      </span>
                      <span>{s.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded">
                      <div
                        className="bg-blue-500 h-3 rounded"
                        style={{ width: `${(s.base_stat / 250) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-5xl font-bold text-black drop-shadow-lg flex items-center mx-20">
          VS
        </div>

        {/* Enemy Card */}
        <div className="flex-1 backdrop-blur-sm p-4 rounded-2xl border-2 border-gray-800 shadow-lg min-w-[250px]">
          <h2 className="text-xl font-bold mb-2 text-center">Enemy Pokémon</h2>
          {enemyPokemon && (
            <div className="text-center">
              <h3 className="capitalize text-lg font-semibold">
                {enemyPokemon.name}
              </h3>
              <img
                src={enemyPokemon.sprites.front_default}
                alt={enemyPokemon.name}
                className="w-32 m-auto"
              />
              <div className="flex justify-center gap-2 mt-2">
                {enemyPokemon.types.map((t, i) => (
                  <span
                    key={i}
                    className="px-4 py-1 rounded text-white text-xs"
                    style={{ backgroundColor: typeColor(t.type.name) }}
                  >
                    {t.type.name.toUpperCase()}
                  </span>
                ))}
              </div>
              {/* HP nella card */}
              <div className="mt-4">
                <div className="flex justify-between text-sm font-semibold">
                  <span>HP</span>
                  <span>{enemyHP}</span>
                </div>
                <div className="w-full bg-gray-300 h-3 rounded">
                  <div
                    className="bg-red-500 h-3 rounded"
                    style={{ width: `${(enemyHP / enemyMaxHP) * 100}%` }}
                  />
                </div>
              </div>
              {/* Stats */}
              <div className="mt-4 space-y-2">
                {enemyPokemon.stats.map((s) => (
                  <div key={s.stat.name}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="capitalize">
                        {s.stat.name.replace("-", " ")}
                      </span>
                      <span>{s.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-3 rounded">
                      <div
                        className="bg-red-500 h-3 rounded"
                        style={{ width: `${(s.base_stat / 250) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Audio */}
      <audio ref={audioRef} src={bgBattleMusic} loop />
    </div>
  );
};

export default BattleScreen;

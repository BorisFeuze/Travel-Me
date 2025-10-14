import { useNavigate } from "react-router";
import gifLoading from "../assets/Pika Sticker.gif";
import { usePokemon } from "@/context";
import { typeColor } from "@/utils";

import fireCard from "../assets/fire.png";
import waterCard from "../assets/water.png";
import grassCard from "../assets/grass.png";
import electricCard from "../assets/electryc.png";
import psychicCard from "../assets/physic.png";
import iceCard from "../assets/water.png";
import dragonCard from "../assets/dark.png";
import darkCard from "../assets/dark.png";
import fairyCard from "../assets/grass.png";
import poisonCard from "../assets/dark.png";
import normalCard from "../assets/dark.png";
// import BgHome from "../assets/bghome.png";

export const typeCard: Record<string, string> = {
  fire: fireCard,
  water: waterCard,
  grass: grassCard,
  electric: electricCard,
  psychic: psychicCard,
  ice: iceCard,
  dragon: dragonCard,
  dark: darkCard,
  fairy: fairyCard,
  poison: poisonCard,
  default: normalCard,
};

export default function Home() {
  const { pokemons, loading, setPokemonId } = usePokemon();
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <img src={gifLoading} alt="Pikachu running" className="w-40 h-auto" />
        <progress className="progress w-40 mt-10"></progress>
      </div>
    );

  return (
    <div
      className="w-[80%] min-h-screen grid grid-cols-1 sm:grid-cols-[minmax(150px,1fr)_minmax(150px,1fr)] md:grid-cols-[repeat(3,minmax(180px,1fr))] lg:grid-cols-[repeat(4,minmax(200px,1fr))] gap-6 p-4 pt-50 m-auto"
      // style={{
      //   backgroundImage: `url(${BgHome})`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      //   backgroundAttachment: "fixed",
      // }}
    >
      {pokemons.map((p: Pokemon) => (
        <div key={p.id} className="relative w-full flex flex-col items-center">
          {/* Carta con Pokémon */}
          <div className="relative w-full max-w-[25rem]">
            {/* Carta come immagine */}
            <img
              src={typeCard[p.types[0].type.name] || typeCard.default}
              alt={p.types[0].type.name}
              className="w-full h-auto rounded-xl"
              style={{
                backgroundColor: `${typeColor(p.types[0].type.name)}40`, // 20 = trasparente (hex alpha)
                boxShadow: `0 0 12px ${typeColor(p.types[0].type.name)}33`, // 33 = ombra leggera
              }}
            />

            {/* Nome Pokémon + tipi in alto a sinistra */}
            <div className="absolute top-5 left-17 flex flex-raw gap-1  px-2 py-1 rounded">
              <span className="capitalize text-black text-base sm:text-lg md:text-xl font-bold ">
                {p.name}
              </span>
            </div>
            <div className="flex gap-1 flex-wrap absolute top-17 left-11 ">
              {p.types.map((t) => (
                <span
                  key={t.type.name}
                  className="px-2 rounded-full text-white text-[0.65rem] sm:text-xs md:text-sm font-semibold border-2 border-black"
                  style={{ backgroundColor: typeColor(t.type.name) }}
                >
                  {t.type.name.toUpperCase()}
                </span>
              ))}
            </div>

            {/* Pokémon centrato */}
            <img
              src={p.sprites.front_default}
              alt={p.name}
              className="absolute top-24 left-1/2 transform -translate-x-1/2 w-40 h-auto"
            />

            {/* Stati centrati in basso */}
            <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 w-[90%] sm:w-[80%] md:w-[85%] px-2 py-2 text-black bg-white/40 rounded-lg border border-gray-200">
              {p.stats.map((s) => (
                <div
                  key={s.stat.name}
                  className="text-[0.7rem] sm:text-[0.8rem] md:text-[1rem] text-black mb-1"
                >
                  <div className="flex justify-between">
                    <span className="capitalize">
                      {s.stat.name.replace("-", " ")}
                    </span>
                    <span>{s.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-300 h-1 sm:h-1.5 md:h-1.5 rounded border">
                    <div
                      className="bg-yellow-500 h-1 sm:h-1.5 md:h-1.5 rounded"
                      style={{ width: `${(s.base_stat / 250) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottone sotto la carta */}
          <div className="mt-2 flex justify-center w-full">
            <button
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md text-md font-semibold transition-all cursor-pointer"
              onClick={() => {
                setPokemonId(p.id);
                navigate("/battle");
              }}
            >
              Catch 'em All!
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from "react";
import BgLega from "../assets/Lega_di_Unima_Stadio.png";
import { getAllUserCards } from "@/data/userCards";

const LeaderBoard = () => {
  const [userCards, setUserCards] = useState<UserCard[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllUserCards();
        setUserCards(data);

        console.log("UserCards loaded from DB:", data);
      } catch (err) {
        console.error("Error fetching userCards:", err);
      }
    })();
  }, []);

  // Ordina gli utenti per punti decrescente
  const sortedUserCards = userCards
    .filter((userCard) => userCard.points && userCard.points > 0)
    .sort((a, b) => b.points! - a.points!);

  const getBackground = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white";
      case 1:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-white";
      case 2:
        return "bg-gradient-to-r from-orange-400 to-orange-500 text-white";
      default:
        return "bg-white text-black";
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
      style={{ backgroundImage: `url(${BgLega})` }}
    >
      <div className="relative z-10 flex justify-center pt-[120px] min-h-screen">
        <div className="bg-red-50 w-[70%] border-4 border-amber-300 rounded-3xl">
          <div className="max-w-3xl mx-auto p-6 rounded-xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
              Leaderboard
            </h1>

            <div className="space-y-4">
              {sortedUserCards.map((userCard, index) => (
                <div
                  key={userCard._id}
                  className={`flex items-center justify-between px-6 py-4 rounded-xl shadow ${getBackground(
                    index
                  )}`}
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-2xl font-bold">{index + 1}</span>
                    <p className="text-lg font-semibold">
                      {userCard.userId.firstName} {userCard.userId.lastName}
                    </p>
                    <p className="text-sm">
                      Wins: {userCard.score?.wins || 0} • Losses:{" "}
                      {userCard.score?.losses || 0}
                    </p>
                  </div>

                  <div className="text-2xl font-bold">{userCard.points}</div>

                  {userCard.pokemonId && (
                    <img
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${userCard.pokemonId}.png`}
                      alt="pokemon"
                      className="w-20 h-20"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;

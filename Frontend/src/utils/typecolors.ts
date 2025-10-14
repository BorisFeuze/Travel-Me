export const typeColor = (type: string) => {
  switch (type) {
    case "fire":
      return "#F08030";
    case "water":
      return "#6890F0";
    case "grass":
      return "#78C850";
    case "electric":
      return "#F8D030";
    case "psychic":
      return "#F85888";
    case "ice":
      return "#98D8D8";
    case "dragon":
      return "#7038F8";
    case "dark":
      return "#705848";
    case "fairy":
      return "#EE99AC";
    case "poison":
      return "#A040A0";
    default:
      return "#A8A878";
  }
};

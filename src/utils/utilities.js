// renvoie le nom au format adapté pour l'url: en minuscules, les espaces remplacés par des -
export function validateName(inputText) {
  return inputText.toLowerCase().split(" ").join("-");
}

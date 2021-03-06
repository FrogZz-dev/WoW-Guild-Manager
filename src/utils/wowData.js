import { validateName } from "./utilities";

const apiKey = process.env.REACT_APP_BLIZZARD_API_CLIENT_ID;
const apiSecret = process.env.REACT_APP_BLIZZARD_API_CLIENT_SECRET;
// const redirectUri = process.env.REACT_APP_BLIZZARD_API_REDIRECT_URI;
let clientAccessToken = "";

const wowData = {
  regionList: [
    {
      name: "Europe",
      tag: "eu",
    },
    {
      name: "United States",
      tag: "us",
    },
    {
      name: "Korea",
      tag: "kr",
    },
    {
      name: "Taiwan",
      tag: "tw",
    },
  ],

  rankList: [
    { id: 0, name: "Maître de guilde" },
    { id: 1, name: "Co-MG" },
    { id: 2, name: "RL Master" },
    { id: 3, name: "Officier PVE" },
    { id: 6, name: "Raiders" },
    { id: 7, name: "Membre" },
    { id: 4, name: "Vétéran" },
    { id: 8, name: "Novice" },
    { id: 9, name: "Absence" },
  ],

  // récupère le token enregistré localement ou en demande un nouveau
  async setToken() {
    if (!sessionStorage.getItem("blizzardAccessToken")) {
      try {
        sessionStorage.setItem(
          "blizzardAccessToken",
          await this.createAccessToken(apiKey, apiSecret)
        );
      } catch (error) {
        console.log(error);
      }
    }
    clientAccessToken = sessionStorage.getItem("blizzardAccessToken");
  },

  // demande un token
  async createAccessToken(apiKey, apiSecret, region = "us") {
    const requestPath = `https://${region}.battle.net/oauth/token`;
    const basicAuth = btoa(`${apiKey}:${apiSecret}`);

    const params = new URLSearchParams();
    const headers = {
      authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };
    params.append("grant_type", "client_credentials");

    const requestOptions = {
      method: "POST",
      body: params,
      headers,
    };
    const response = await fetch(requestPath, requestOptions);
    if (response.ok) {
      const resJson = await response.json();
      return resJson.access_token;
    }
    throw new Error("Erreur lors de la récupération du token");
  },

  // renvoie le nom du rang en fonction de son id
  getRankById(id) {
    const rankObject = this.rankList.find((rank) => rank.id === id);
    return rankObject ? rankObject.name : id;
  },

  // chargement de la liste des personnages de la guilde
  async getGuildRoster(region, realm, guildName) {
    const validGuildName = validateName(guildName);
    const fetchUri = `https://${region}.api.blizzard.com/data/wow/guild/${realm}/${validGuildName}/roster?namespace=profile-${region}&access_token=${clientAccessToken}`;

    const response = await fetch(fetchUri);

    if (response.ok) {
      const resJson = await response.json();

      return resJson.members;
    } else {
      throw new Error(
        "Une erreur s'est produite lors de la récupération des membres"
      );
    }
  },

  // chargement des informations d'un personnage
  async getCharacterInfo(region, realm, characterName) {
    const validCharacterName = validateName(characterName);
    const fetchUri = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${validCharacterName}?namespace=profile-${region}&locale=fr_Fr&access_token=${clientAccessToken}`;

    const response = await fetch(fetchUri);
    if (response.ok) {
      const resJson = await response.json();

      return resJson;
    }
  },

  // Récupération des noms de classes
  async getClassesList(region) {
    const fetchUri = `https://${region}.api.blizzard.com/data/wow/playable-class/index?namespace=static-${region}&locale=fr_Fr&access_token=${clientAccessToken}`;

    try {
      const response = await fetch(fetchUri);
      if (response.ok) {
        const resJson = await response.json();

        return resJson;
      }
    } catch (error) {}
  },
};

export default wowData;

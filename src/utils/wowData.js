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

  // renvoi le nom au format adapté pour l'url: en minuscules, les espaces remplacés par des -
  validateName(inputText) {
    return inputText.toLowerCase().split(" ").join("-");
  },

  async getGuildRoster(region, realm, guildName) {
    const validGuildName = this.validateName(guildName);
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

  async getCharacterInfo(region, realm, characterName) {
    const validCharacterName = this.validateName(characterName);
    const fetchUri = `https://${region}.api.blizzard.com/profile/wow/character/${realm}/${validCharacterName}?namespace=profile-${region}&locale=fr_Fr&access_token=${clientAccessToken}`;

    const response = await fetch(fetchUri);
    if (response.ok) {
      const resJson = await response.json();

      return resJson;
    } else {
      throw new Error(`${characterName} introuvable`);
    }
  },
};

export default wowData;

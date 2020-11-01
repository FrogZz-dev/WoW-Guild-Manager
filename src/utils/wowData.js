const apiKey = process.env.REACT_APP_BLIZZARD_API_CLIENT_ID;
const apiSecret = process.env.REACT_APP_BLIZZARD_API_CLIENT_SECRET;
const redirectUri = process.env.REACT_APP_BLIZZARD_API_REDIRECT_URI;
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

  async getRealmList(region) {
    const fetchUri = `https://${region}.api.blizzard.com/data/wow/realm/index?namespace=dynamic-${region}&access_token=${clientAccessToken}`;

    const response = await fetch(fetchUri);
    if (response.ok) {
      const resJson = await response.json();
      return resJson.realms;
    }
    throw new Error("Erreur lors de la récupération des serveurs?");
  },

  async getGuildInfo(region, realm, guildName) {
    const fetchUri = `https://${region}.api.blizzard.com/data/wow/guild/${realm}/${guildName}?namespace=profile-${region}&access_token=${clientAccessToken}`;

    const response = await fetch(fetchUri);

    if (response.ok) {
      const resJson = await response.json();
      console.log(resJson); // return resJson.realms;
    } else {
      throw new Error("Guilde introuvable, vérifiez son nom");
    }
  },
};

export default wowData;

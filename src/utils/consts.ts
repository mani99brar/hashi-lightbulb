import type { Address } from "viem";

// Core enum/typing
export type HashiAddress = {
  adapter: Address;
  reporter: Address;
};

export enum Bridges {
  LZ = "LayerZero",
  CCIP = "CCIP",
  VEA = "Vea",
  DEBRIDGE = "deBridge",
  AXELAR = "Axelar",
}

// Chain IDs for routing
export const CHAIN_IDS = {
  ETHEREUM: 1,
  BASE: 8453,
  ARBITRUM: 42161,
  STORY: 1514,
  SEPOLIA: 11155111,
  CHIADO: 10200,
  ARB_SEPOLIA: 421614,
  BASE_SEPOLIA: 84532,
} as const;

// A directional route between two chains, mirroring
// veashi-contracts/broadcast/<source>-<destination>.json
export type Route = {
  source: number;
  destination: number;
  // Source-side contracts
  switch: Address;
  yaho: Address;
  // Destination-side contracts
  lightbulb: Address;
  /** Missing for routes whose Yaru is not deployed yet — execution is disabled */
  yaru?: Address;
  // Reporters live on the source chain, adapters on the destination chain
  bridges: Partial<Record<Bridges, HashiAddress>>;
};

export const routeKey = (source: number, destination: number) =>
  `${source}-${destination}`;

// One entry per broadcast/<source>-<destination>.json.
// 11155111-84532 is omitted: its broadcast file has no switch/lightbulb.
export const ROUTES: Record<string, Route> = {
  [routeKey(CHAIN_IDS.ETHEREUM, CHAIN_IDS.BASE)]: {
    source: CHAIN_IDS.ETHEREUM,
    destination: CHAIN_IDS.BASE,
    switch: "0xACe8c605BBf459f6BDEd6FEc31e5B5E2CcC39F36" as Address,
    yaho: "0x47F3Ba12550dFA097c77A10eB6472a881Ea5AA0e" as Address,
    lightbulb: "0x8D79dCd8D71aF391d6aa864A6141Ee307BC1f69f" as Address,
    yaru: "0x6edeB1ee954744512A1928B13e7C3Ce5D8Ad84fC" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x5ad7BF3F57055C41140d03cFf428C3c1CB763c0b" as Address,
        reporter: "0x99A4Cf71D089a282Ac171D9bDFEB7D182Ff13f83" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x7B62e030cFc4445d39ca5b70d0e5917660B335E8" as Address,
        reporter: "0x1ef5f1E4d06AD60e9A3FD64D00782c21523F7317" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0xd76AD89c56D99A43378e497cd3Ff70130B64cbe4" as Address,
        reporter: "0x57841Cb92dde96467eDEA3A5c0eaB3AFd0985514" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.BASE, CHAIN_IDS.ETHEREUM)]: {
    source: CHAIN_IDS.BASE,
    destination: CHAIN_IDS.ETHEREUM,
    switch: "0x1F851DE0e959ad33193e5449EC4C23A66eAdbCC7" as Address,
    yaho: "0x88fAa01842E32beA05b167C679443009c3891183" as Address,
    lightbulb: "0xD0375320591ff87797CEb03CBeE80C82fD61BC77" as Address,
    yaru: "0x86F316598225b472b8aA8Df366C0E827C1A75C2f" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0xC704f9113f447914E385BE312b88d544105efaF7" as Address,
        reporter: "0xc69d76763F19518A36Ec388B8a1ad042535a5191" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x9fBc03780c1AAc814E6BAD2C35Af4f55fCb31D69" as Address,
        reporter: "0xC704f9113f447914E385BE312b88d544105efaF7" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0xBc9f3762A996667A6E0d8dfA70092b7EEC1a6557" as Address,
        reporter: "0x98555b9A3Fa80D4725Db6C4B849a18594b162B87" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.ARBITRUM, CHAIN_IDS.BASE)]: {
    source: CHAIN_IDS.ARBITRUM,
    destination: CHAIN_IDS.BASE,
    switch: "0x60af9Fc1dd7d5bce69a66A8AEf456952b03A39C7" as Address,
    yaho: "0xD0375320591ff87797CEb03CBeE80C82fD61BC77" as Address,
    lightbulb: "0xC3C43514787E7eDf44e629C3832E623cfb733770" as Address,
    yaru: "0x8eF6a2C992fCAA06C9E4e08399fad407CAB2eDBF" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0xE8A05651c3C8a9fE1C8F07D4A4Bf9D225D7Ab6b3" as Address,
        reporter: "0xA6243C9DDf54de341De4D30F6955bdF50dE8e488" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x9a8b9BE75F5811989a47b7b3749EAC3D95bbDD80" as Address,
        reporter: "0x40126673C226c4dc4329332E761993e0d7215cA4" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0xc8763f92fCf64b37dB9eC840406E22D01BBe0A29" as Address,
        reporter: "0x36fed3b8eaeB87ab8Bc7dB90FA394fD7a1279CfB" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.BASE, CHAIN_IDS.ARBITRUM)]: {
    source: CHAIN_IDS.BASE,
    destination: CHAIN_IDS.ARBITRUM,
    switch: "0xe14E10D605a3c0D1ccc182998239048243810584" as Address,
    yaho: "0x88fAa01842E32beA05b167C679443009c3891183" as Address,
    lightbulb: "0xf720FA4575FB2FE96c7f05B1b5abc2d281cDa09a" as Address,
    yaru: "0x7Be1C881942D196D5A5Fd258F6957E1E138aaF46" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x55d6eE3D0ebbB82D58E7437FC905Fc19229Be424" as Address,
        reporter: "0xDb364bDCbE89319A28dbaaD7B2225767316f845e" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0xfFA5A8A87b81b7087039a6Df4A71d819db66fE54" as Address,
        reporter: "0xafc2b3026d2D3eD1Fbfeb045AC69C1EF3fcfb8f7" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0x8E217460313B3841BD712219D3907D189ED52993" as Address,
        reporter: "0xB589ADAb067Fae921fAFdc1e8b724Bd798FD71B1" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.ARBITRUM, CHAIN_IDS.STORY)]: {
    source: CHAIN_IDS.ARBITRUM,
    destination: CHAIN_IDS.STORY,
    switch: "0x592dc5Aaf28f860af5E01088C6Aa55AFCB057e61" as Address,
    yaho: "0xD0375320591ff87797CEb03CBeE80C82fD61BC77" as Address,
    lightbulb: "0x110a3Bf7E7B3DDA31de9B5987b4368Da295DF2C1" as Address,
    yaru: "0x5f629f27BA26E17e7E309D886A8490d9e0124bd1" as Address,
    bridges: {
      [Bridges.DEBRIDGE]: {
        adapter: "0x8c45cEFC3e7272560A4ABa91Be1c8661f27F1e49" as Address,
        reporter: "0xf8eb4EabCeD8ce7393d9AE5bb329cb2BF48A812d" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x0099aAA79f30eFF626e0E2229833dA66Bfd3968d" as Address,
        reporter: "0x9Ccc5868d92424695F151aA5e0B3168398b768ee" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.STORY, CHAIN_IDS.ARBITRUM)]: {
    source: CHAIN_IDS.STORY,
    destination: CHAIN_IDS.ARBITRUM,
    switch: "0xeD1995Ae173cb68CFd419d91AAee1698e2F5B894" as Address,
    yaho: "0x0313f25f51f8846fdDFaBCb7F0672e4D3E1C0E76" as Address,
    lightbulb: "0x2773DCFb27C0ED863648AB0cd45e77cC77f00E94" as Address,
    yaru: "0x43017e1d9f66f7E7Be4055CFf6a490F57aF9b8De" as Address,
    bridges: {
      [Bridges.DEBRIDGE]: {
        adapter: "0x47F3Ba12550dFA097c77A10eB6472a881Ea5AA0e" as Address,
        reporter: "0x455bc1B342b32165BEfA1262C90D780F45F959eD" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x84a1A3389a26104De5db4B9Ffac242ca1DcF7Dda" as Address,
        reporter: "0x81B3c15F6fB28b8aEa41b2739417B1934B3A7DdD" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.ARB_SEPOLIA, CHAIN_IDS.SEPOLIA)]: {
    source: CHAIN_IDS.ARB_SEPOLIA,
    destination: CHAIN_IDS.SEPOLIA,
    switch: "0xc9b4e0F220Ca36c619D9726af57773FBAd04dd31" as Address,
    yaho: "0xDbdF80c87f414fac8342e04D870764197bD3bAC7" as Address,
    lightbulb: "0x5f39183d9c449A9E82845B5FBe05799c47BeB102" as Address,
    yaru: "0x231e48AAEaAC6398978a1dBA4Cd38fcA208Ec391" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x6058464f467CE7dD95308B6b21D4ec5583e8624F" as Address,
        reporter: "0x847Da10a801b0273dee2fAc20372a90Df3Fa8c12" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0xfDF0777B3602794D59dDBE3FCce3157758856a1b" as Address,
        reporter: "0xCe95f5758f513e7Eb8E035C97a4802265fEf840E" as Address,
      },
      [Bridges.VEA]: {
        adapter: "0x8C04D410B1F3B5907dDf4F017FAf7DF1D7f5F597" as Address,
        reporter: "0xE803DA11AfC72CEa6Fa1A0AfC344015Cce5410A9" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.ARB_SEPOLIA, CHAIN_IDS.CHIADO)]: {
    source: CHAIN_IDS.ARB_SEPOLIA,
    destination: CHAIN_IDS.CHIADO,
    switch: "0xA974928D7Be03B708da8f6722529a3260104bAF1" as Address,
    yaho: "0xDbdF80c87f414fac8342e04D870764197bD3bAC7" as Address,
    lightbulb: "0xa2E63e22B03493Cc1939CBEc4Bf7187465A53b3E" as Address,
    yaru: "0x639c26C9F45C634dD14C599cBAa27363D4665C53" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x1cb5049CEe358585fA20bb1b99487bC627D48AD1" as Address,
        reporter: "0xf2c03A6Fe57C89be19c646C087C76db2fc02d05F" as Address,
      },
      [Bridges.VEA]: {
        adapter: "0x35635360B90F6eB3517c42D07a05DB13C22dE93D" as Address,
        reporter: "0xB836d71eBbB81f71cc0b83d6Ee64575F871CBb72" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.ARB_SEPOLIA, CHAIN_IDS.BASE_SEPOLIA)]: {
    source: CHAIN_IDS.ARB_SEPOLIA,
    destination: CHAIN_IDS.BASE_SEPOLIA,
    switch: "0x9791F68665dB93CC340dBC00d07561E31A200424" as Address,
    // broadcast/421614-84532.json has no yaho entry; Yaho is shared per source
    // chain on Arbitrum Sepolia (same address in both other 421614 routes)
    yaho: "0xDbdF80c87f414fac8342e04D870764197bD3bAC7" as Address,
    lightbulb: "0x6D90FA6EC82FA119c5c2569cCAEd191B524f34f4" as Address,
    yaru: "0xFe9fF402A80EF4aBA0181759ad4ECDAfc815dFbf" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x813A65f57A9BD7Cf13D67313FF718C2D28B4E51d" as Address,
        reporter: "0xdfF2235A9E4D126a0a45EDf1760b2a8be987480e" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x26CdE2A31681FB27266A529A3F4DA33415C54FBF" as Address,
        reporter: "0xb06E6759a93860b8B397Bd88DBFBC3A6C07dF6B2" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0xeA5DdDC8E5cD3b80a4fCFE4E938CDe08719503cE" as Address,
        reporter: "0x4d15fAEa79898e7AC7F1DC11E5820DCb467c9d1F" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.BASE_SEPOLIA, CHAIN_IDS.ARB_SEPOLIA)]: {
    source: CHAIN_IDS.BASE_SEPOLIA,
    destination: CHAIN_IDS.ARB_SEPOLIA,
    switch: "0x2C4b4cDa6F25b7Fca664a3163a229FE48183A6CE" as Address,
    yaho: "0xf69BCD5Ff8A64919BE217bC017454aba4f6daa9D" as Address,
    lightbulb: "0x0cac47dA782A3f6b4a91CC28e3cdDde20DD2c7F1" as Address,
    yaru: "0xEA3799EA443bf65a7Dc8C1dBfd9e64962f9Af724" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x5F7c9793954C6EEEa446EFDb21C98F63112B5058" as Address,
        reporter: "0xB4176186C618840274cd744FdDc020d536A097d8" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x6d8085afA4685f107b5e231f08780839a5a58aD9" as Address,
        reporter: "0x47329408a647B27B0B9DE99F6f563077680B672E" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0xd79A5E222A5cf2C7777d5b79C4c378Be130A13bb" as Address,
        reporter: "0x277EF2f87C41d441e7Eaa14681ba9A0ac5553408" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.BASE_SEPOLIA, CHAIN_IDS.SEPOLIA)]: {
    source: CHAIN_IDS.BASE_SEPOLIA,
    destination: CHAIN_IDS.SEPOLIA,
    switch: "0x00f08C98e1e5554f9BD62C6351CC8d2cf62d0530" as Address,
    yaho: "0xcfD14674659bB15D0304a3608239a46A14d77554" as Address,
    lightbulb: "0x471e1D688C651e538cDE5E17bdF53294E94183B3" as Address,
    yaru: "0x17962c255EA4D3DAb522d96CDd211F839cA5dfB3" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x694012bb92511715fd2AA38AB6CB20C95C80BCb2" as Address,
        reporter: "0x21FAa2D656F09Fa535C8F0Dded562A34F20E3F03" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x809E22466B8CD30CCDAf1424C2295f47F781A8c0" as Address,
        reporter: "0xA3DbB4b6e49db5397836976B5Ec89E4887932EC5" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0x5ECD57eBda6eE4403ee9D0203f409f7CBb9de50c" as Address,
        reporter: "0xA813eF49645493C7860709e9cB6a4AF788A9D2CC" as Address,
      },
    },
  },
  [routeKey(CHAIN_IDS.SEPOLIA, CHAIN_IDS.BASE_SEPOLIA)]: {
    source: CHAIN_IDS.SEPOLIA,
    destination: CHAIN_IDS.BASE_SEPOLIA,
    switch: "0x068E44A74f49085fBC0c408Bc6Eae43bf585f896" as Address,
    yaho: "0xb286025885808F2A2D42cd9e2204D007f52b135e" as Address,
    lightbulb: "0x1D59a0dda84ccBdEeae0D2161c8F77A00e17D601" as Address,
    yaru: "0xd2130B20CB7A1E11cBA1451B029020d5a33229Bc" as Address,
    bridges: {
      [Bridges.CCIP]: {
        adapter: "0x3E7b05c278d33Ce8f9058282CF628f135263d0b8" as Address,
        reporter: "0xAA5cA1780e6EE781f4550370c504d1f22eA859af" as Address,
      },
      [Bridges.LZ]: {
        adapter: "0x5e6fcfCaa61e4Db57858b7611eD2eC9Fb8e450dd" as Address,
        reporter: "0xb1678E1df6d66c071b7046F1Ab67d57774f22c89" as Address,
      },
      [Bridges.AXELAR]: {
        adapter: "0x5afB69fd2C375BBD09D995FaF5f4b3fD1Ba70315" as Address,
        reporter: "0x59AFEfa42f089BC58F3cbFC330eAb01c32Dd1da0" as Address,
      },
    },
  },
};

export const ROUTE_LIST: Route[] = Object.values(ROUTES);

export const SOURCE_CHAIN_IDS: number[] = [
  ...new Set(ROUTE_LIST.map((r) => r.source)),
];

export function destinationsForSource(source: number): number[] {
  return ROUTE_LIST.filter((r) => r.source === source).map(
    (r) => r.destination,
  );
}

export function getRoute(
  source: number,
  destination: number,
): Route | undefined {
  return ROUTES[routeKey(source, destination)];
}

export const DEFAULT_ROUTE: Route =
  ROUTES[routeKey(CHAIN_IDS.ARB_SEPOLIA, CHAIN_IDS.CHIADO)];

export const TESTNET_CHAIN_IDS: readonly number[] = [
  CHAIN_IDS.SEPOLIA,
  CHAIN_IDS.CHIADO,
  CHAIN_IDS.ARB_SEPOLIA,
  CHAIN_IDS.BASE_SEPOLIA,
];

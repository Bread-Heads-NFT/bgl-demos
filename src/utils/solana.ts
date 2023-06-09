import { PublicKey, Umi, publicKey } from "@metaplex-foundation/umi";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { findGameAccountPda, safeFetchGameAccount } from "bgl-shootout";

export const getGameAccount = async (umi: Umi, publicKey: PublicKey) => {
      let gamePda = findGameAccountPda(umi, {
        matchName: 'demo',
        payerAddress: AUTH_PUBKEY,
        mint: publicKey,
      });

      let gameAccount = await safeFetchGameAccount(umi, gamePda);
      return gameAccount;
  };

  export const AUTH_PUBKEY = publicKey('duckFKC1NFWSnP25hPyNeTHYbkLsSbcbwKDb7Q4Fh3t')
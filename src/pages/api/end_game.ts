// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Keypair, base58, keypairIdentity, publicKey as newPublicKey } from '@metaplex-foundation/umi';
import { bglShootout, endGame, findGameAccountPda, safeFetchGameAccount } from 'bgl-shootout';
import { Keypair as Web3JSKeypair } from '@solana/web3.js';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchAllDigitalAssetWithTokenByOwner, transferV1, DigitalAsset, mplTokenMetadata, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';

function loadEnvKey(): Keypair {
  const loaded = Web3JSKeypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.AUTH_KEYPAIR)),
  );
  // console.log(`wallet public key: ${loaded.publicKey}`);
  return fromWeb3JsKeypair(loaded);
}

function randomChoice(arr: DigitalAsset[]) {
  return arr[Math.floor(arr.length * Math.random())];
}

type Data = {
  txid: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let publicKeyString = (req.body as string);
  const publicKey = newPublicKey(publicKeyString);

  const umi = createUmi(process.env.RPC_ENDPOINT);
  umi.use(bglShootout());
  umi.use(mplTokenMetadata())
  let signer = loadEnvKey();
  umi.use(keypairIdentity(signer));

  let gamePda = findGameAccountPda(umi, {
    matchName: 'demo',
    payerAddress: signer.publicKey,
    mint: publicKey,
  });

  try {
    let gameAccount = await safeFetchGameAccount(umi, gamePda);
    console.log(`gameAccount: ${gameAccount}`);

    let builder = endGame(umi, {
      gamePda,
      matchName: 'demo',
      mint: publicKey,
    });

    // If the game account exists then send them a prize.
    if (gameAccount) {
      if (gameAccount.playerWins > gameAccount.cpuWins) {
        let das = await fetchAllDigitalAssetWithTokenByOwner(umi, signer.publicKey);
        console.log(`DigitalAssets: ${das}`);
        for (let da of das) {
          console.log(da.metadata.name);
        }

        if (das.length > 0) {
          if (Math.random() > 0.9) {
            let choice = randomChoice(das);
            if (choice.metadata.tokenStandard.__option !== 'None') {
              builder = builder.add(
                transferV1(umi, {
                  mint: choice.metadata.mint,
                  tokenOwner: signer.publicKey,
                  destinationOwner: publicKey,
                  tokenStandard: choice.metadata.tokenStandard.value,
                })
              );
            }
          } else {
            builder = builder.add(
              transferV1(umi, {
                mint: newPublicKey('Bqf4Ep42BVL6gbFc47WUrV1jWhkPxYVbzqtMHaE7L63F'),
                tokenOwner: signer.publicKey,
                destinationOwner: publicKey,
                tokenStandard: TokenStandard.FungibleAsset,
              })
            );
          }
        }
      }
    }

    let result = await builder.sendAndConfirm(umi, { send: { commitment: 'confirmed', maxRetries: 100 } });
    console.log(`result: ${result}`);

    res.status(200).json({ txid: base58.deserialize(result.signature)[0] })
  } catch (e: any) {
    console.log(e);
    res.status(200).json({ txid: 'null' })
  }
}

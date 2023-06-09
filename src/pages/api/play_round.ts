// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Keypair, base58, keypairIdentity, publicKey as newPublicKey, signerIdentity } from '@metaplex-foundation/umi';
import { Action, bglShootout, findGameAccountPda, playRound } from 'bgl-shootout';
import { Keypair as Web3JSKeypair } from '@solana/web3.js';
import { fromWeb3JsKeypair } from '@metaplex-foundation/umi-web3js-adapters';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

function loadEnvKey(): Keypair {
  const loaded = Web3JSKeypair.fromSecretKey(
    new Uint8Array(JSON.parse(process.env.AUTH_KEYPAIR)),
  );
  // console.log(`wallet public key: ${loaded.publicKey}`);
  return fromWeb3JsKeypair(loaded);
}

type Data = {
  txid: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let [publicKeyString, actionString] = (req.body as String).split(':');
  const publicKey = newPublicKey(publicKeyString);
  let action;
  if (actionString === Action.Duck.toString()) {
    action = Action.Duck;
  } else if (actionString === Action.Lasso.toString()) {
    action = Action.Lasso;
  } else {
    action = Action.Shoot;
  }

  console.log(publicKey);
  console.log(action);

  const umi = createUmi(process.env.RPC_ENDPOINT);
  umi.use(bglShootout());
  let signer = loadEnvKey();
  umi.use(keypairIdentity(signer));

  let gamePda = findGameAccountPda(umi, {
    matchName: 'demo',
    payerAddress: signer.publicKey,
    mint: publicKey,
  });

  try {
    let result = await playRound(umi, {
      gamePda,
      matchName: 'demo',
      mint: publicKey,
      action: action,
    }).sendAndConfirm(umi, { send: { commitment: 'confirmed', maxRetries: 100 } });

    res.status(200).json({ txid: base58.deserialize(result.signature)[0] })
  } catch (e: any) {
    console.log(e);
    res.status(200).json({ txid: 'null' })
  }
}

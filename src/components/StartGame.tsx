import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { notify } from "../utils/notifications";
import { PublicKey, Umi, base58, base58PublicKey, signerIdentity } from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { bglShootout, startGame, findGameAccountPda, safeFetchGameAccount, endGame } from 'bgl-shootout';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { createSignerFromWalletAdapter } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { AUTH_PUBKEY } from 'utils/solana';

interface StartGameArgs {
    umi: Umi,
    publicKey: PublicKey,
    text: String,
    setLoading: Dispatch<SetStateAction<boolean>>,
}

export const StartGame: FC<StartGameArgs> = (props: StartGameArgs) => {
    const onClick = useCallback(async () => {
        props.setLoading(true);
        // const umi = createUmi(connection.rpcEndpoint);
        // umi.use(bglShootout());

        let gamePda = findGameAccountPda(props.umi, {
            matchName: 'demo',
            payerAddress: AUTH_PUBKEY,
            mint: props.publicKey,
        });

        const gameAccount = await safeFetchGameAccount(props.umi, gamePda);

        if (gameAccount) {
            let result = 'null';
            while (result === 'null') {
                const response = await fetch('api/end_game', {
                    method: 'POST',
                    body: base58PublicKey(props.publicKey)
                });
                let jsonResult = await response.json();
                result = jsonResult['txid'];
                console.log(jsonResult);
            }
            // await endGame(umi, {
            //     gamePda,
            //     matchName: 'demo',
            //     mint: fromWeb3JsPublicKey(publicKey),
            // }).sendAndConfirm(umi, { send: { commitment: 'finalized' }});

            while (await safeFetchGameAccount(props.umi, gamePda)){
                // await new Promise(res => setTimeout(res, 1000));
            };
        }

        await startGame(props.umi, {
            gamePda,
            authority: AUTH_PUBKEY,
            matchName: 'demo',
            mint: props.publicKey,
            numRounds: 3,
        }).sendAndConfirm(props.umi, { send: { maxRetries: 100 } });
        props.setLoading(false);
    }, [props]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-900 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                    className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-green-500 to-green-900 hover:from-white hover:to-purple-300 text-black"
                    onClick={onClick} disabled={!props.publicKey}
                >
                    <div className="hidden group-disabled:block ">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden" >
                        {props.text}
                    </span>
                </button>
            </div>
        </div>
    );
};
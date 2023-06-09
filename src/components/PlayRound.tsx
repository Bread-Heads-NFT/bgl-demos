import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { notify } from "../utils/notifications";
import { findGameAccountPda, Action, playRound } from 'bgl-shootout';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { Umi, base58, base58PublicKey } from '@metaplex-foundation/umi';
import { AUTH_PUBKEY } from 'utils/solana';

interface PlayRoundArgs {
    name: string,
    action: Action,
    umi: Umi,
    setLoading: Dispatch<SetStateAction<boolean>>,
}

export const PlayRound: FC<PlayRoundArgs> = (props: PlayRoundArgs) => {
    const { publicKey } = useWallet();

    const onClick = useCallback(async () => {
        props.setLoading(true);
        const umi = props.umi;

        // let gamePda = findGameAccountPda(umi, {
        //     matchName: 'demo',
        //     payerAddress: AUTH_PUBKEY,
        //     mint: fromWeb3JsPublicKey(publicKey),
        // });
        let result = 'null';
        while (result === 'null') {
            const response = await fetch('api/play_round', {
                method: 'POST',
                body: base58PublicKey(publicKey) + ':' + props.action.toString()
            });
            let jsonResult = await response.json();
            result = jsonResult['txid'];
            console.log(jsonResult);
        }
        // let result = await playRound(umi, {
        //     gamePda,
        //     matchName: 'demo',
        //     mint: fromWeb3JsPublicKey(publicKey),
        //     action: props.action,
        // }).sendAndConfirm(umi, { send: { commitment: 'finalized'} });

        // console.log(result);
        // if (result.result.value.err) {
        //     notify({ type: 'error', message: 'Transaction failed!', txid: base58.deserialize(result.signature)[0] });
        // } else {
        //     notify({ type: 'success', message: 'Transaction successful!', txid: base58.deserialize(result.signature)[0] });
        // }
        props.setLoading(false);
    }, [props, publicKey]);

    return (
        <div className="flex flex-row justify-center">
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-green-500 to-green-900 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <button
                    className="group font-extrabold text-3xl w-60 m-2 btn animate-pulse bg-gradient-to-br from-green-500 to-green-900 hover:from-white hover:to-purple-300 text-black"
                    onClick={onClick} disabled={!publicKey}
                >
                    <div className="hidden group-disabled:block ">
                        Wallet not connected
                    </div>
                    <span className="block group-disabled:hidden" >
                        {props.name}
                    </span>
                </button>
            </div>
        </div>
    );
};

import { FC, useEffect, useState } from "react";
import { useInterval } from 'usehooks-ts';
import { Backdrop, Chip, CircularProgress, Stack, Tooltip } from '@mui/material';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { bglShootout, GameAccount, Action } from 'bgl-shootout';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { StartGame } from "components/StartGame";
import { PlayRound } from "components/PlayRound";
import { createSignerFromWalletAdapter } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { PublicKey, Signer, Umi, signerIdentity } from "@metaplex-foundation/umi";
import { MatchDisplay } from "components/MatchDisplay";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { getGameAccount } from "utils/solana";

export const ShootoutView: FC = ({ }) => {
  let [gameAccount, setGameAccount] = useState<GameAccount | null>(null);
  const { wallet, publicKey } = useWallet();
  let [umiPublicKey, setUmiPublicKey] = useState<PublicKey>();
  const [open, setOpen] = useState(false);
  const [delay, setDelay] = useState<number>(null);
  const { connection } = useConnection();
  let [loading, setLoading] = useState(false);
  let [signer, setSigner] = useState<Signer | null>(null);
  let [umi, setUmi] = useState<Umi>(createUmi(connection.rpcEndpoint));

  useEffect(() => {
    if (publicKey) {
      setUmiPublicKey(fromWeb3JsPublicKey(publicKey));
    }
    if (connection && publicKey && umi) {
      setDelay(1000);
    }
    if (signer === null && wallet && wallet.adapter) {
      let newSigner = createSignerFromWalletAdapter(wallet.adapter);
      setSigner(newSigner);
      setUmi(umi.use(signerIdentity(newSigner)));
      setUmi(umi.use(bglShootout()));
    }
  }, [connection, publicKey, signer, umi, wallet]);

  useInterval(() => {
    if (publicKey) {
      getGameAccount(umi, fromWeb3JsPublicKey(publicKey)).then((gameAccount) => { setGameAccount(gameAccount) });
    }
  }, delay);

  if (gameAccount) {
    const rounds = gameAccount.playerWins + gameAccount.cpuWins + gameAccount.draws;

    if (rounds < gameAccount.numRounds) {
      return (
        <div className="md:hero mx-auto p-4">
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <div className="md:hero-content flex flex-col">
            <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10">
              Shootout
            </h1>
            {/* CONTENT GOES HERE */}
            <Tooltip title={<><div>Shoot beats Lasso</div><div>Lasso beats Duck</div><div>Duck beats Shoot</div></>}>
              <Chip
                className="w-50 text-center text-2xl font-bold bg-gradient-to-br from-green-500 to-green-900 mt-1 mb-1"
                label="Rules"
                icon={<InformationCircleIcon className="w-5 text-center text-2xl font-bold" />}
              />
            </Tooltip>
            <MatchDisplay umi={umi} gameAccount={gameAccount} />
            <Stack direction={'row'} justifyContent={'center'}>
              <div className="text-center">
                <PlayRound name="Shoot" action={Action.Shoot} umi={umi} setLoading={setLoading} />
              </div>
              <div className="text-center">
                <PlayRound name="Lasso" action={Action.Lasso} umi={umi} setLoading={setLoading} />
              </div>
              <div className="text-center">
                <PlayRound name="Duck" action={Action.Duck} umi={umi} setLoading={setLoading} />
              </div>
            </Stack>
          </div>
        </div>
      );
    }
    else {
      if (gameAccount.playerWins > gameAccount.cpuWins) {
        return (
          <div className="md:hero mx-auto p-4">
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <div className="md:hero-content flex flex-col">
              <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10 mb-8">
                Shootout
              </h1>
              {/* CONTENT GOES HERE */}
              <div className="text-center">
                <h2 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10 mb-8">You Won!</h2>
              </div>
              <div className="text-center">
                <StartGame text={"Play Again"} umi={umi} setLoading={setLoading} publicKey={umiPublicKey} />
              </div>
            </div>
          </div>
        )
      }
      else if (gameAccount.playerWins < gameAccount.cpuWins) {
        return (
          <div className="md:hero mx-auto p-4">
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <div className="md:hero-content flex flex-col">
              <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10 mb-8">
                Shootout
              </h1>
              {/* CONTENT GOES HERE */}
              <div className="text-center">
                <h2 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10 mb-8">You Lost!</h2>
              </div>
              <div className="text-center">
                <StartGame text={"Play Again"} umi={umi} setLoading={setLoading} publicKey={umiPublicKey} />
              </div>
            </div>
          </div>
        )
      }
      else {
        return (
          <div className="md:hero mx-auto p-4">
            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <div className="md:hero-content flex flex-col">
              <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10 mb-8">
                Shootout
              </h1>
              {/* CONTENT GOES HERE */}
              <div className="text-center">
                <h2 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10 mb-8">It&apos;s a Draw!</h2>
              </div>
              <div className="text-center">
                <StartGame text={"Play Again"} umi={umi} setLoading={setLoading} publicKey={umiPublicKey} />
              </div>
            </div>
          </div>
        )
      }
    }
  }
  else {
    return (
      <div className="md:hero mx-auto p-4">
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div className="md:hero-content flex flex-col">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-green-500 to-green-900 mt-10 mb-8">
            Shootout
          </h1>
          {/* CONTENT GOES HERE */}
          <Tooltip title={<><div>Shoot beats Lasso</div><div>Lasso beats Duck</div><div>Duck beats Shoot</div></>}>
            <Chip
              className="w-50 text-center text-2xl font-bold bg-gradient-to-br from-green-500 to-green-900 mt-1 mb-1"
              label="Rules"
              icon={<InformationCircleIcon className="w-5 text-center text-2xl font-bold" />}
            />
          </Tooltip>
          <div className="text-center">
            <StartGame text={"Start Game"} umi={umi} setLoading={setLoading} publicKey={umiPublicKey} />
          </div>
        </div>
      </div>
    );
  }
};

import type { NextPage } from "next";
import Head from "next/head";
import { ShootoutView } from "../views";

const Shootout: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Basic Functionality"
        />
      </Head>
      <ShootoutView />
    </div>
  );
};

export default Shootout;

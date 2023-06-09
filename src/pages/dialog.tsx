import type { NextPage } from "next";
import Head from "next/head";
import { DialogView } from "../views";

const Dialog: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>BGL Dialog Quest</title>
        <meta
          name="description"
          content="BGL Dialog Quest"
        />
      </Head>
      <DialogView />
    </div>
  );
};

export default Dialog;

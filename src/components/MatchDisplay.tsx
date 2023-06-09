import { Umi } from "@metaplex-foundation/umi";
import { fromWeb3JsPublicKey } from "@metaplex-foundation/umi-web3js-adapters";
import { Box, Chip, Stack } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { GameAccount } from "bgl-shootout";
import { FC, useEffect, useState } from "react";
import { useInterval } from 'usehooks-ts';
import { getGameAccount } from "utils/solana";

interface MatchDisplayArgs {
    umi: Umi,
    gameAccount: GameAccount,
}

const PROMPTS = [
    "Toast Town Showdown: In the wheat-woven town of Toast Town, a newcomer loaf known as Rye Ryan irks the resident sheriff, Wholemeal Wes, by claiming the best oven spot at the town bakery. The heated dispute soon escalates into a yeast-raising showdown at high noon.",
    "Baguette Bounty: Crusty Carlos, a notorious baguette bandit, rides into the quiet grain settlement of Pumpernickel Point. After he swindles the town’s supply of precious yeast, the furious citizens turn to their steadfast defender, Sourdough Sam, resulting in a fierce standoff at the mill.",
    "Baker's Duel: In the middle of the crumb-filled city of Crust Creek, a competition for the title of the Best Baker creates tension between two pieces of bread, Multigrain Mike and Bagel Ben. Their argument soon escalates into a wild west-style shootout for the coveted Baker’s Badge.",
    "Muffin vs Marmite: A misunderstanding over a beloved spread leads to an altercation between two longtime friends, Ciabatta Clint and Focaccia Frank, in the heart of Butter Bun Valley. The disagreement eventually sparks a full-blown gunfight, their poppy-seed pistols glinting under the midday sun.",
    "The Yeast Uprising: In the bustling town of Biscuit Basin, a bitter rivalry between the sweet, savory factions leads to a duel between Sweet Brioche Billy and Salty Pretzel Pete. The wheat-dusted streets bear silent witness to their wild west style shootout, each vying for control of the local bakery.",
    "Gluten Gulch Gambit: Naan Nancy, a peaceful bread inhabitant of Gluten Gulch, is forced into a challenging duel when Gluten-Free Gary attempts to seize control of the town’s flour mill. The typically quiet town is on edge as the face-off escalates, with Gary wielding his gluten-free guns against Nancy's wheat-imbued weapons.",
    "Doughnut's Desperation: When the notorious Doughnut Desperado seeks to claim the sweet land of Pastries’ Paradise, Panini Pat stands up to defend the territory. A wild west-style shootout ensues in the main square, where each bread combatant is backed by their fellow pastries and sandwiches.",
    "Rising Tensions: In the heart of Kneadville, a rough-and-tumble rising dough named Rugged Raisin Roll squares off against the town's longtime guardian, Gentleman Garlic Bread. The disagreement, originally over the new kneading technique, swells into a high noon shootout in the town square.",
    "Challah Challenge: When a daring challah known as Hasty Hallie steps on the crust of sourdough sheriff, Sourdough Sid, at the local yeast fest, the sourdough’s anger begins to ferment. The confrontation inevitably escalates into a wild west-style shootout in the heart of Yeastville.",
    "Flour Power Showdown: In the secluded town of Rye Ridge, two artisanal bakers, Baguette Bobby and Fougasse Freddie, have a disagreement over the traditional baking methods. Their fight for flour power culminates in a thrilling shootout on the dusty, breadcrumb-littered main street.",
    "Crust Crusader's Confrontation: An argument over the perfect crust formation pits Pretzel Paul against the long-respected town chef, Ciabatta Charlie, in the tranquil community of Loaf Landing. The disagreement quickly rises into a wild west-style shootout under the burning bread baking sun.",
    "Buns at Dawn: A case of mistaken recipe theft in the busy town of Bunville leads to a standoff between its two most prominent citizens - Pita Pete and Multigrain Mary. The bakery turns into a battlefield, with both sides brandishing their grain guns, ready to defend their honor.",
    "Sesame Street Skirmish: In the crunchy heart of Sesame Street, an all-out gunfight erupts between two dough adversaries: the refined Baguette Bart and the no-nonsense Naan Neil. The town is split, eagerly watching as the two breads prepare to settle their grudges, with flour dust replacing the typical gunpowder.",
    "The Great Grains Showdown: A battle over the supremacy of grains leads to a dramatic showdown between Quinoa Quinn and Spelt Spencer in the bustling town of Granary Grove. With each combatant swearing by their grain, tensions rise, culminating in a high-noon shootout that shakes the quiet town to its crusty core.",
];

export const MatchDisplay: FC<MatchDisplayArgs> = (props: MatchDisplayArgs) => {
    let [prompt, setPrompt] = useState<string>();
    let [gameAccount, setGameAccount] = useState<GameAccount | null>(null);
    let { publicKey } = useWallet();

    useEffect(() => {
        const random = Math.floor(Math.random() * PROMPTS.length);
        setPrompt(PROMPTS[random]);
    }, [])

    useInterval(() => {
        if (publicKey){
          getGameAccount(props.umi, fromWeb3JsPublicKey(publicKey)).then((gameAccount) => {setGameAccount(gameAccount)});
        }
      }, 1000);

    return (
        <div>
            <Box
                component="div"
                className="font-mono text-green-700 text-4xl"
            >
                {prompt}
            </Box>
            <Stack
                direction={'row'}
                justifyContent={'center'}
                width={'100%'}
            >
                <Box
                    component="div"
                    className="text-center w-60 text-4xl m-4 font-bold bg-gradient-to-br font-mono from-green-500 to-green-900 text-black"
                >
                    WINS: {props.gameAccount.playerWins}
                </Box>
                <Box
                    component="div"
                    className="text-center w-60 text-4xl m-4 font-bold bg-gradient-to-br font-mono from-green-500 to-green-900 text-black"
                >
                    LOSSES: {props.gameAccount.cpuWins}
                </Box>
                <Box
                    component="div"
                    className="text-center w-60 text-4xl m-4 font-bold bg-gradient-to-br font-mono from-green-500 to-green-900 text-black"
                >
                    DRAWS: {props.gameAccount.draws}
                </Box>
            </Stack>
        </div>
    );
};
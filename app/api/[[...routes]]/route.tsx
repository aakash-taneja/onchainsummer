/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { abi } from "./abi.js";
import { abidegen } from "./abidegen.js";
import { parseEther } from "viem";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: 60,
            fontStyle: "normal",
            letterSpacing: "-0.025em",
            lineHeight: 1.4,
            marginTop: 30,
            padding: "0 120px",
            whiteSpace: "pre-wrap",
          }}
        >
          {status === "response"
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ""}`
            : "Welcome!"}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button.Transaction target="/approve">Approve</Button.Transaction>,
      <Button.Transaction target="/mint">Collect</Button.Transaction>,
      <Button.Transaction target="/addNFT">Add NFT</Button.Transaction>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

let contractAddress = "0x6b4FDE96c7de27107585BCf75a391e25418772Ba";
let baseMain = "eip155:8453";

app.transaction("/approve", (c) => {
  const address = c.address;
  // Contract transaction response.
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi: abidegen,
    chainId: "eip155:84532",
    functionName: "approve",
    args: ["0x3389fE7B62D5b121E27aDdb52316e1BaAcD7da75", parseEther("1000")],
    to: "0xb51A718519104a7Cd69A16b79003035053B67EA8",
    // value: amountInWei,
  });

  return tx;
});
app.transaction("/addNFT", (c) => {
  const address = c.address;
  // Contract transaction response.
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "addNFT",
    args: [`${Date.now()}`, "100000000000000000", "1000"],
    to: "0x3389fE7B62D5b121E27aDdb52316e1BaAcD7da75",
    // value: amountInWei,
  });

  return tx;
});
app.transaction("/mint", (c) => {
  const address = c.address;
  // Contract transaction response.
  const amountInWei = parseEther("0.000777"); // Converts 0.000777 Ether to wei using viem's utility function
  // console.log(`amount: ${amountInWei}`);
  console.log(`${address}`);
  let tx;

  tx = c.contract({
    abi,
    chainId: "eip155:84532",
    functionName: "mintNFT",
    args: [
      2, //nftId
      "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", // affiliate (address)
      10, // amount
    ],
    to: "0x3389fE7B62D5b121E27aDdb52316e1BaAcD7da75",
    // value: amountInWei,
  });

  return tx;
});

app.frame("/finish", (c) => {
  const { transactionId } = c;
  return c.res({
    image: (
      <div style={{ color: "white", display: "flex", fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    ),
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

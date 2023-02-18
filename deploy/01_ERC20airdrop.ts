import fs from 'fs';
import path from 'path';
import { ethers, run } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { constants } from "ethers";
import { MerkleTree } from "merkletreejs";
import { arrayify } from "ethers/lib/utils";
import * as CryptoJS from 'crypto-js';
import merkle from "../generator/merkle.json";

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;

  const name = "eludius18 Tree";
  const symbol = "ETR";
/*   const merkleJsonPath = path.join(__dirname, '..', 'generator', 'output', 'merkle.txt');
  const merkleJsonString = fs.readFileSync(merkleJsonPath, 'utf-8');
  const merkle = JSON.parse(merkleJsonString);
  const merkleRoot = merkle.root; */
  const merkleRoot = "0x6acf6c1a918b6c2d5c421b3358165eadaa2b3b187cdc095c8d88e11d25a719b6";

  const erc20airdrop = await deploy("ERC20Airdrop", {
    from: deployer,
    args: [
      name,
      symbol,
      merkleRoot
    ],
    log: true,
    waitConfirmations: 10,
  });

  console.log("ERC20Airdrop deployed at: ", erc20airdrop.address);

  const erc20AirdropDeployed = await ethers.getContractAt(
    "ERC20Airdrop",
    erc20airdrop.address
  );
  await delay(5000);
  await run("verify:verify", {
    address: erc20AirdropDeployed.address,
    constructorArguments: [
      name,
      symbol,
      merkleRoot
    ],
    contract: "contracts/ERC20Airdrop.sol:ERC20Airdrop",
  });
  
};
deploy.tags = ["ERC20Airdrop"];
export default deploy;
import { MerkleTree } from 'merkletreejs';
const keccak256 = require('keccak256');
import * as fs from 'fs';
const accounts = require('../source/accounts.json');

const elements = (accounts as string[]).map(address => address.toLowerCase());

const tree = new MerkleTree(elements, keccak256, { hashLeaves: true, sortPairs: true });

const root = tree.getHexRoot();

console.log('Merkle tree root: ', root);

fs.writeFileSync('./output/merkle.txt', `Merkle tree root: ${root}\n`, { flag: 'w' });

for (let i = 0; i < elements.length; i++) {
  const leaf = keccak256(elements[i]);

  const proof = tree.getHexProof(leaf);

  const address = elements[i];

  console.log(`Proof for address ${address}: `, proof);

  fs.appendFileSync('./output/merkle.txt', `${address}: ${JSON.stringify(proof)}\n`, { flag: 'a' });
}
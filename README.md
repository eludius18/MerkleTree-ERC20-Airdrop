# Generator

## Run locally

```bash
# Navigate to generator directory, if not already there
cd generator/

# Install dependencies
npm install

# Edit accounts.json
vim accounts.json

# Run script
npm run start
```
# Output Merkle Root and Proof
Outputs a `merkle.txt`, in the following format:

```.txt
Merkle tree root: 
0x3c7dbfad5c91e22bb678291dfb8a42320fcffa91: ["",""]
0x70997970c51812dc3a010c7d01b50e0d17dc79c8: ["",""]
0x03c6fced478cbbc9a4fab34ef9f40767739d1ff7: ["",""]
0x70997970c51812dc3a010c7d01b50e0d17dc79c8: ["",""]
```
# Token ERC20 Airdrop Deployment

## Run locally

```bash
# Install dependencies
npm install

# Run deploy
vim accounts.json
npx hardhat deploy --network <network-in-hardhat.config> --tags ERC20Airdrop
```

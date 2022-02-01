# Decentralized Decisions DApp

The Decentralized Decisions software allows for votes to be held on issues for the Choice Coin DAO, enabling a new form of direct and decentralized democratic decision making. The software leverages the Algorand blockchain to provide a new, scalable, and secure voting technology.

Credit to @prettyirrelevant and @Alphatron for coding this infrastructure.
Credit to @FionnaChan for her contributions to the design.

Research Paper on Decentralized Decisions: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3913316

# Important Updates

Before running the dApp, you must run the following lines from the terminal to appropriately update the code.

npm install react-script@5.0.0

npm update follow-redirects --depth 5

# Run Steps
To run locally, cd into the directory and run *sh run.sh* from your terminal. This will open up a local server running the React App. 
Make sure to have some Testnet Choice, either by creating a new asset or obtaining some from TinyMan's Testnet site: https://testnet.tinyman.org/#/swap?asset_in=0&asset_out=21364625. Be sure to alter the asset id parameter under *constants* in the *frontend* folder if you create a new asset id.

# Rewards Script
To send out rewards, make sure that you are in the rewards directory. Download all the requirements in your local Python Instance through pip by running *pip install requirements.txt*. Replace the *voter_1_address* and the *voter_1_mneomnic* variables with the address and mneomonic of the wallet you are sending the rewards from. Then, visit algoexplorer: https://algoexplorer.io/api-dev/indexer-v2. Under *lookup*, try out the second option, fill all the parameters appropriately (The *max round* and *min round* variables can be used to restrict the time interval in which the rewards script works. The min round will be the round for the first Choice sent to the address for the vote, while the max round will be the round for the last Choice sent), and copy the url that is generated. Use this url for the blank string in the second part of the *main* variable in the *rewards.py* file. Finally, edit the *amount* variable in line *60* to match the rewards rate. Then, run the *rewards.py* file. This process will need to be repeated for each address you are sending rewards from.

# Votes

The first vote session, Vote 0, will go live on December 27th. Blog on Vote 0: https://medium.com/@ChoiceCoin/choice-coin-governance-vote-0-b34147169429

Next up, Vote 1: https://medium.com/@ChoiceCoin/choice-coin-governance-vote-1-e6763c31ae89

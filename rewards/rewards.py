# Choice Coin Governance Rewards Code.

from algosdk import account, encoding, mnemonic,algod
from algosdk.future.transaction import AssetTransferTxn, PaymentTxn, AssetConfigTxn
from algosdk.future.transaction import AssetFreezeTxn
from algosdk.v2client import algod
from algorand_demo import choice_trade
import json
import urllib3

choice_id  = 297995609
voter_1_address = ""
voter_1_mnemonic = ""
voter_1_key = mnemonic.to_private_key(voter_1_mnemonic)

def choice_trade(sender, key, receiver, amount, index,comment):
    parameters = algod_client.suggested_params()
    transaction = AssetTransferTxn(sender, parameters, receiver, amount, index,note=comment)
    #Defines an inital transaction for choice Coin
    signature = transaction.sign(key)
    #Signs the transaction with the senders private key
    algod_client.send_transaction(signature)
    #Sends the transaction with the signature
    final = transaction.get_txid()
    return True, final

def fetch_addresses():
	http = urllib3.PoolManager()
	main = http.request('GET','')
	json_list = json.loads(main.data.decode('utf-8'))
	with open('data.json', 'w', encoding='utf-8') as f:
		json.dump(json_list, f, ensure_ascii=False, indent=4)
	with open('data.json') as json_file:
		data = json.load(json_file)
		transaction_data = data['transactions']
		data_file = open('file.csv', 'w')
		csv_writer = csv.writer(data_file)
		count = 0
		for transaction in transaction_data:
		    if count == 0:
		        header = transaction.keys()
		        csv_writer.writerow(header)
		        count += 1
		    csv_writer.writerow(transaction.values())

		data_file.close()

def give_rewards():
	with open('data.json', 'r') as json_file:
		data = json.load(json_file)
		transaction_data = data['transactions']
		for transaction in transaction_data:
			amount = transaction["asset-transfer-transaction"]["amount"]
			amount = int(amount)
			amount = amount + amount * 0.12 #Rewards rate hardcoded
			address = transaction['sender']
			id = transaction['id']
			choice_trade(voter_1_address,voter_1_key,address,amount,choice_id,"Rewards!" + id)
# fetch_addresses()
# give_rewards()

//Replace the "Proposal.js" file with this in order to convert to MainNet
//Make sure to replace the blank strings with actual addresses before
import $ from "jquery";
import axios from "axios";
import algosdk from "algosdk";
import { useState } from "react";
import "./styles/electionlist.css";
import { useQuery } from "react-query";
import BarLoader from "react-spinners/BarLoader";
import WalletConnect from "@walletconnect/client";
import MyAlgoConnect from "@randlabs/myalgo-connect";
import { useDispatch, useSelector } from "react-redux";
import { formatJsonRpcRequest } from "@json-rpc-tools/utils";
import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { ASSET_ID, ELECTION_ID, URL, ADDRESS_1, ADDRESS_2 } from "./constants";

const Proposal = () => {
  const dispatch = useDispatch();

  const [address1, setAddress1] = useState(0);
  const [address2, setAddress2] = useState(0);

  const { isLoading, error, data } = useQuery("elections", () =>
    axios.get('https://choicecoinapi.herokuapp.com/api/proposals/').then((response) => {
      if (response?.data?.data) {
        setAddress1(response?.data?.data[ADDRESS_1]);
        setAddress2(response?.data?.data[ADDRESS_2]);
      }
    })
  );

  const darkTheme = useSelector((state) => state.status.darkTheme);
  const algod_token = {
    "X-API-Key":"nH6GvZZLPE2a6yZSLX2BH7Mk5HArCVlF61zv7ps1"
  };
  const algod_address = "https://mainnet-algorand.api.purestake.io/ps2";
  const headers = "";

  const algodClient = new algosdk.Algodv2(algod_token, algod_address, headers);
  const walletType = localStorage.getItem("wallet-type");
  const isThereAddress = localStorage.getItem("address");

  const proposal_data = [
    {
      card_desc:
        "Submit the proposal with a title and state your case clearly to increase it's chances of getting voted to be approved for final voting on decentralized decision.",
      choice_per_proposal: 1,
      description: "Lorem ipsum",
      process_image: "https://i.postimg.cc/pXn0NRzL/logo.gif",
      title: "Proposal Form",
      wallet: {
        address: "LONCFPK6NP7SFDGGULOWTRROHY5THPX73RSZQF5I5LASRC5JASCN6NUVMM",
      },
    },
  ];

  const myAlgoConnect = async (propData) => {
    const myAlgoWallet = new MyAlgoConnect();

    try {
      const accounts = await myAlgoWallet.connect({
        shouldSelectOneAccount: true,
      });
      const address = !!isThereAddress ? isThereAddress : accounts[0].address;

      const myAccountInfo = await algodClient
        .accountInformation(
          !!isThereAddress ? isThereAddress : accounts[0].address
        )
        .do();

      // get balance of the voter
      const balance = myAccountInfo.assets
        ? myAccountInfo.assets.find(
            (element) => element["asset-id"] === ASSET_ID
          ).amount / 100
        : 0;

      // check if the voter address has Choice
      const containsChoice = myAccountInfo.assets
        ? myAccountInfo.assets.some(
            (element) => element["asset-id"] === ASSET_ID
          )
        : false;

      // if the address has no ASAs
      if (myAccountInfo.assets.length === 0) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to Choice Coin in your Algorand Wallet.",
        });
        return;
      }

      if (!containsChoice) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You need to opt-in to Choice Coin in your Algorand Wallet.",
        });
        return;
      }

      if (propData.amount > balance) {
        dispatch({
          type: "alert_modal",
          alertContent:
            "You do not have sufficient balance to make this transaction.",
        });
        return;
      }

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = 1;

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: "LONCFPK6NP7SFDGGULOWTRROHY5THPX73RSZQF5I5LASRC5JASCN6NUVMM",
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
      });

      const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
      await algodClient.sendRawTransaction(signedTxn.blob).do();

      // alert success
      dispatch({
        type: "alert_modal",
        alertContent: "Your proposal has been submitted.",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured the during transaction process",
        });
      }
    }
  };

  const algoSignerConnect = async (propData) => {
    try {
      if (typeof window.AlgoSigner === "undefined") {
        window.open(
          "https://chrome.google.com/webstore/detail/algosigner/kmmolakhbgdlpkjkcjkebenjheonagdm",
          "_blank"
        );
      } else {
        await window.AlgoSigner.connect({
          ledger: "MainNet",
        });
        const accounts = await window.AlgoSigner.accounts({
          ledger: "MainNet",
        });

        const address = !!isThereAddress ? isThereAddress : accounts[0].address;

        const myAccountInfo = await algodClient
          .accountInformation(
            !!isThereAddress ? isThereAddress : accounts[0].address
          )
          .do();

        // get balance of the voter
        const balance = myAccountInfo.assets
          ? myAccountInfo.assets.find(
              (element) => element["asset-id"] === ASSET_ID
            ).amount / 100
          : 0;

        // check if the voter address has Choice
        const containsChoice = myAccountInfo.assets
          ? myAccountInfo.assets.some(
              (element) => element["asset-id"] === ASSET_ID
            )
          : false;

        // if the address has no ASAs
        if (myAccountInfo.assets.length === 0) {
          dispatch({
            type: "alert_modal",
            alertContent:
              "You need to opt-in to Choice Coin in your Algorand Wallet.",
          });
          return;
        }

        if (!containsChoice) {
          dispatch({
            type: "alert_modal",
            alertContent:
              "You need to opt-in to Choice Coin in your Algorand Wallet.",
          });
          return;
        }

        if (propData.amount > balance) {
          dispatch({
            type: "alert_modal",
            alertContent:
              "You do not have sufficient balance to make this transaction.",
          });
          return;
        }

        const suggestedParams = await algodClient.getTransactionParams().do();
        const amountToSend = 1;

        const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: address,
          to: "LONCFPK6NP7SFDGGULOWTRROHY5THPX73RSZQF5I5LASRC5JASCN6NUVMM",
          amount: amountToSend,
          assetIndex: ASSET_ID,
          suggestedParams,
        });

        const signedTxn = await window.AlgoSigner.signTxn([
          { txn: window.AlgoSigner.encoding.msgpackToBase64(txn.toByte()) },
        ]);
        await algodClient
          .sendRawTransaction(
            window.AlgoSigner.encoding.base64ToMsgpack(signedTxn[0].blob)
          )
          .do();

        // alert success
        dispatch({
          type: "alert_modal",
          alertContent: "Your proposal has been submitted.",
        });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured the during transaction process",
        });
      }
    }
  };

  const algoMobileConnect = async (propData) => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org",
      qrcodeModal: QRCodeModal,
    });

    try {
      const address = !!isThereAddress ? isThereAddress : "";

      const myAccountInfo = await algodClient.accountInformation(address).do();

      const balance = myAccountInfo.assets
        ? myAccountInfo.assets.find(
            (element) => element["asset-id"] === ASSET_ID
          ).amount / 100
        : 0;

      const containsChoice = myAccountInfo.assets
        ? myAccountInfo.assets.some(
            (element) => element["asset-id"] === ASSET_ID
          )
        : false;

      if (myAccountInfo.assets.length === 0) {
        alert("You need to opt-in to Choice Coin in your Algorand Wallet.");
        return;
      }

      if (!containsChoice) {
        alert("You need to opt-in to Choice Coin in your Algorand Wallet.");
        return;
      }

      if (propData.amount > balance) {
        alert("You do not have sufficient balance to make this transaction.");
        return;
      }

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = 1;

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: "LONCFPK6NP7SFDGGULOWTRROHY5THPX73RSZQF5I5LASRC5JASCN6NUVMM",
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
      });

      const txnsToSign = [
        {
          txn: Buffer.from(algosdk.encodeUnsignedTransaction(txn)).toString("base64"),
          message: "Transaction using Mobile Wallet",
        },
      ];

      const requestParams = [txnsToSign];

      const request = formatJsonRpcRequest("algo_signTxn", requestParams);
      const result = await connector.sendCustomRequest(request);

      const decodedResult = result.map((element) => {
        return element ? new Uint8Array(Buffer.from(element, "base64")) : null;
      });

      console.log(decodedResult);
      await algodClient.sendRawTransaction(decodedResult).do();
      // alert success
      dispatch({
        type: "alert_modal",
        alertContent: "Your vote has been recorded.",
      });
      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      if (error.message === "Can not open popup window - blocked") {
        dispatch({
          type: "alert_modal",
          alertContent:
            "Pop Up windows blocked by your browser. Enable pop ups to continue.",
        });
      } else {
        dispatch({
          type: "alert_modal",
          alertContent: "An error occured during the transaction process",
        });
      }
    }
  };

  const submit_proposal = (address, amount, election) => {
    if (address) {
      dispatch({
        type: "alert_modal",
        alertContent: "Please Connect Your Wallet!!",
      });
      return;
    }

    if (walletType === "my-algo") {
      myAlgoConnect({ address, amount, election });
    } else if (walletType === "algosigner") {
      algoSignerConnect({ address, amount, election });
    } else if (walletType === "walletconnect") {
      algoMobileConnect({ address, amount, election });
    };
    submitForm();
  };

  const [formData,setFormdata]= useState({
    'title':'',
    'case':'',
    'amount':'',
  });

  const handleChange = (event)=>{
    setFormdata({
      ...formData,
      [event.target.name]:event.target.value
    });

  }

  const submitForm = () =>{
    const data = new FormData();
    data.append('title',formData.title)
    data.append('case',formData.case)
    data.append('amount',formData.amount)


    try{
      axios.post('https://choicecoinapi.herokuapp.com/api/proposals/',data).then((response)=>{
        setFormdata({
          'title':'',
          'case':'',
          'amount':'',
        });
      });
    }catch(error){
      console.log(error);
    };

  };

  if (isLoading)
    return (
      <div className="ptt_elt">
        <div className="ptt_elt_inn">
          <div className="ptt_hd">
            
          </div>

          <ul className="card_list">
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                color: "var(--wht)",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: darkTheme ? 400 : 500,
                textTransform: "uppercase",
              }}
            >
              <p style={{ opacity: 0.8, margin: "30px 0px 20px" }}>Loading</p>
              <BarLoader
                color={darkTheme ? "#eee" : "#888"}
                size={150}
                speedMultiplier="0.5"
              />
            </div>
          </ul>
        </div>
      </div>
    );
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="ptt_elt">
      <div className="ptt_elt_inn">
        <div className="ptt_hd">
          <p></p>
        </div>

        <ul className="card_list">
          {proposal_data?.map((slug, index) => {
            return (
              <div className="card_cont" key={index}>
                <div className="card_r1">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <div className="card_elt_img">
                      {slug.process_image ? (
                        <img src={slug.process_image} alt="" />
                      ) : (
                        <i
                          className="uil uil-asterisk"
                          style={{ paddingLeft: "2px", paddingBottom: "2px" }}
                        />
                      )}
                    </div>
                    <div className="card_elt_tit">{slug.title}</div>
                  </div>
                </div>

                <div className="card_elt_desc">{slug?.card_desc}</div>

                

                <div className="card_cand">
                  <div className="card_cand_hd">
                    <form className='mt-4'>
                  
                      <input onChange={handleChange} name='title' className="form-control" type="text" placeholder="Title:"/>
                      <label htmlFor="case" className="form-label mt-2">Case:</label>
                      <textarea onChange={handleChange} name='case' className="form-control" id="case" rows="3"></textarea>
                  
                      <div className="amountToCommit">
                        <p>Amount to commit:</p>
                        <input onChange={handleChange} name="amount" type="number" min="1" defaultValue={1} className="amtToCommitInp"/>
                      </div>
                    </form>
                  </div>

                  <div className="vote_collap">

                    

                    <div className="rec_vote_cont">
                      <button
                        className="record_vote"
                        onClick={(e) => {
                          var voteVal = $(e.target)
                            .closest(".card_cand")
                            .find(".vote_now_list");

                          var amountToSend = $(e.target)
                            .closest(".card_cand")
                            .find(".amtToCommitInp")
                            .val();

                          var amt = !!amountToSend
                            ? amountToSend
                            : slug.choice_per_proposal;

                          submit_proposal(
                            $("input[name=options]:checked", voteVal).val(),
                            amt,
                            slug
                          );
                        }}
                      >
                        Submit Proposal <i className="uil uil-mailbox"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Proposal;
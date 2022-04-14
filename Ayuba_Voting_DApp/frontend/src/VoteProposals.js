//Replace the "ElectionList.js" file with this in order to convert to MainNet
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

const ElectionList = () => {
  const dispatch = useDispatch();

  const [address1, setAddress1] = useState(0);
  const [address2, setAddress2] = useState(0);
  const [propData,setpropData] = useState([])

  const { isLoading, error, data } = useQuery("elections", () =>
    axios.get('https://choicecoinapi.herokuapp.com/api/approved_proposal/').then((response) => {
        setpropData(response.data);
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

  const election_data = [
    {
      candidates: [
        {
          address: "Q7Y4STQ3ULFRT6ZSBHRKVEVKZOU7JKOIEZH5V4BDBEWUZ3OVNCSFFKG2V4",
          image: "",
          name: propData.map(data=>{ return data.proposal.option1}),
        },

        {
          address: "LONCFPK6NP7SFDGGULOWTRROHY5THPX73RSZQF5I5LASRC5JASCN6NUVMM",
          image: "",
          name: propData.map(data=>{ return data.proposal.option2}),
        },
      ],
      //card_desc:
        //"This Issue addresses Choice Charities, an initiative focused on charitable contributions from the DAO. This Issue has two options.",
      choice_per_vote: 1,
      created_at: "2021-12-08T10:32:15.878473",
      description: "Lorem ipsum",
      is_finished: false,
      is_started: true,
      process_image: "https://i.postimg.cc/pXn0NRzL/logo.gif",
      slug: "is-choice-coin-the-best-b0c7db",
      title: "Proposal Vote",
      wallet: {
        address: "LONCFPK6NP7SFDGGULOWTRROHY5THPX73RSZQF5I5LASRC5JASCN6NUVMM",
      },
    },
  ];

  const myAlgoConnect = async (voteData) => {
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

      if (voteData.amount > balance) {
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
        to: voteData.address,
        amount: amountToSend,
        assetIndex: ASSET_ID,
        suggestedParams,
      });

      const signedTxn = await myAlgoWallet.signTransaction(txn.toByte());
      await algodClient.sendRawTransaction(signedTxn.blob).do();

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
          alertContent: "An error occured the during transaction process",
        });
      }
    }
  };

  const algoSignerConnect = async (voteData) => {
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

        if (voteData.amount > balance) {
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
          to: voteData.address,
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
          alertContent: "Your vote has been recorded.",
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

  const algoMobileConnect = async (voteData) => {
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

      if (voteData.amount > balance) {
        alert("You do not have sufficient balance to make this transaction.");
        return;
      }

      const suggestedParams = await algodClient.getTransactionParams().do();
      const amountToSend = 1;

      const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: address,
        to: voteData.address,
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

  const placeVote = (address, amount, election) => {
    if (!address) {
      dispatch({
        type: "alert_modal",
        alertContent: "Select an option to vote!!",
      });
      return;
    }

    if (walletType === "my-algo") {
      myAlgoConnect({ address, amount, election });
    } else if (walletType === "algosigner") {
      algoSignerConnect({ address, amount, election });
    } else if (walletType === "walletconnect") {
      algoMobileConnect({ address, amount, election });
    }
  };

  if (isLoading)
    return (
      <div className="ptt_elt">
        <div className="ptt_elt_inn">
          <div className="ptt_hd">
            <p>Vote 1: Choice Charities</p>
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
          {election_data?.map((slug, index) => {
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
                    {propData.map(data=>{
                      return <div className="card_elt_tit">{data.proposal.title}</div>
                  })}
                  </div>
                </div>

                {propData.map(data=>{
                      return <div className="card_elt_desc">{data.proposal.case}</div>
                  })}

                
                  {propData.map(data=>{
                      return <div className="voting_ends">{data.end_date}</div>
                  })}
                

                <div className="results">
                  <div className="resultsTit">Results</div>

                  <div className="results_cont">
                    <div className="optionButt">
                      <div className="optionButtDets">
                        <p>Option 1</p>
                        <p>0 Choice</p>
                      </div>
                      <div className="optRange">
                        <div
                          className="optRangeSlide optRangeSlide1"
                          style={{
                            width: `calc(100% * ${
                              address1 / (address1 + address2)
                            })`,
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="optionButt">
                      <div className="optionButtDets">
                        <p>Option 2</p>
                        <p> 0 Choice</p>
                      </div>
                      <div className="optRange">
                        <div
                          className="optRangeSlide optRangeSlide2"
                          style={{
                            width: `calc(100% * ${
                              address2 / (address1 + address2)
                            })`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card_cand">
                  <div className="card_cand_hd">
                    <div className="amountToCommit">
                      <p>Amount to commit:</p>
                      <input
                        type="number"
                        min="0"
                        placeholder="1"
                        className="amtToCommitInp"
                      />
                    </div>
                  </div>

                  <div className="vote_collap">
                    <div className="card_cand_hd">Options</div>
                    <ul className="vote_now_list">
                      {slug?.candidates?.map((item, index) => {
                        return (
                          <li key={index}>
                            <input
                              type="radio"
                              name="options"
                              value={item.address}
                            />

                            <p>{item.name}</p>
                          </li>
                        );
                      })}
                    </ul>

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
                            : slug.choice_per_vote;

                          placeVote(
                            $("input[name=options]:checked", voteVal).val(),
                            amt,
                            slug
                          );
                        }}
                      >
                        Submit Vote <i className="uil uil-mailbox"></i>
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

export default ElectionList;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import ProgressBar from 'react-bootstrap/ProgressBar';

// const VoteProposals = () => {

//     const [poll,setActivePolls] = useState([]);
//     const [count, setCount] = useState(0);
//     const [count2, setCount2] = useState(0);

//     const url = 'http://127.0.0.1:8000/api/approved_proposal/';

//     useEffect(()=>{
//         axios.get(url).then(
//             (res)=>{
//                 setActivePolls(res.data)
//             }
//         )
//     },[]);

//     const increment = () =>{
//         setCount(count + 1);
//     }

//     const decrement = () =>{
//         setCount2(count2 + 1);
//     }

//   return (
//     <div className='container mx-auto' style={{'marginTop':'170px','marginBottom':'100px'}} >
//         <div className='card card-body w-75 mx-auto'>
//             {poll.map((polls)=>{
//                 return(
//                     <div className='container'>
//                         <div className='card card-body mt-2'>
//                             <p className='card-title text-center'>{polls.proposal.title}</p>
//                             <div className='dropdown-divider'></div>
//                             <p className='card-text'>{polls.proposal.case}</p>
//                             <div className='dropdown-divider'></div>
//                             <div className='row'>
//                                 <div className='col'>
//                                     <ProgressBar variant='secondary' now={count} className='m-2' />
//                                     <label className='mx-2' htmlFor='approve'>Approve</label>
//                                     <input className='mx-2' onClick={increment} name='vote' id='approve' type='radio'/>
//                                 </div>
//                                 <div className='col'>
//                                     <ProgressBar variant='secondary' now={count2} className='m-2' />
//                                     <label className='mx-2' htmlFor='disapprove'>Disapprove</label>
//                                     <input className='mx-2' onClick={decrement} name='vote' id='disapprove' type='radio'/>
//                                 </div>
//                             </div>
//                             <div className='row mt-4'>
//                                 <div className='col-md-8'>
//                                     <input placeholder='Amount to commit' className='form-control m-2' type='number'/>
//                                 </div>
//                                 <div className='col-md'>
//                                     <button className='btn btn-outline-secondary m-2'>Commit Vote</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 )
//             })}
//         </div>
//     </div>
//   )
// }

// export default VoteProposals;




import "./styles/landing.css";
import ScrollTextLand from "./components/ScrollTextLand";

const Landing = () => {
  return (
    <div className="landing" id="landing">
      <ScrollTextLand
        word={
          "Join our Discord Server to learn more and participate in our Open Source Rewards Programs!"
        }
      />

      <div className="land_cov">
        <div className="land_item1">
          <p className="hdy">
            Choice Coin DAO: Bringing Decentralized Governance to the Algorand
            Blockchain
          </p>
          <p className="suby">
            Choice Coin is an Algorand Standard Asset (ASA) that powers the
            Choice Coin DAO, a Decentralized Autonomous Organization built on
            the Algorand Blockchain. The Choice Coin DAO aims to make
            decentralized voting a reality through allocations to open-source
            software development and community awareness.
            <br />
            <br />
      Decentralized Decisions is an open source software platform for decentralized voting and governance. With over 75 contributors on GitHub, it is also the largest open source software project on the Algorand blockchain. The goal for Choice Coin is to help solve the decentralized governance problem by building the world’s best voting technology. Choice Coin is built, developed, and maintained by the Choice Coin DAO, a decentralized autonomous organization on the Algorand blockchain. Vote 1 is the second vote for the Choice Coin DAO.
          </p>
        </div>
        <div className="land_item1">
          <b>
            {" "}
            <h3>Rules</h3>
          </b>

          <ul
            className="suby"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <li>1. One Choice is equal to one vote.</li>
            <li>2. You can vote as many times as you desire.</li>
            <li>
              {" "}
              3. There are no limits on how much Choice you can use to vote.
            </li>
            <li>
              4. Any Choice sent after the voting deadline, Thursday Janurary
              27th at 5:00PM will not count, will not be rewarded, and will not
              be returned.
            </li>
            <li> 5. All votes are final.</li>
          </ul>
        </div>
        <div className="land_item1 okay">
          <h3>Rewards</h3>
          <p className="suby">
        The rewards pool for Vote 1 will be tripled from Vote 0. If up to 3,000,000.00 Choice is committed to vote, then the reward pool will be 1,800,000.00 Choice. If up to 6,000,000.00 Choice is committed to vote, then the reward pool will be 3,000,000.00 Choice. If over 6,000,000.00 Choice is committed to vote, then the reward pool will be 4,200,000.00 Choice. The rewards will be distributed proportionally to all voters.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing;

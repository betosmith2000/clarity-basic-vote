import { Client, Provider, ProviderRegistry, Result } from "@blockstack/clarity";
import { assert } from "chai";
describe("vote contract test suite", () => {
  let voteClient: Client;
  let provider: Provider;
  before(async () => {
    provider = await ProviderRegistry.createProvider();
    voteClient = new Client("SP3GWX3NE58KXHESRYE4DYQ1S31PQJTCRXB3PE9SB.vote", "vote", provider);
  });
  it("should have a valid syntax", async () => {
    await voteClient.checkContract();
  });
  describe("deploying an instance of the contract", () => {
    const getWinner = async () => {
      const query = voteClient.createQuery({
        method: { name: "get-winner", args: [] }
      });
      const receipt = await voteClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }
    const getAllowVote = async () => {
      const query = voteClient.createQuery({
        method: { name: "get-allow-vote", args: [] }
      });
      const receipt = await voteClient.submitQuery(query);
      const result = Result.unwrapInt(receipt);
      return result;
    }
    const execMethod = async (method: string) => {
      const tx = voteClient.createTransaction({
        method: {
          name: method,
          args: [],
        },
      });
      await tx.sign("SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7");
      const receipt = await voteClient.submitTransaction(tx);
      return receipt;
    }
    before(async () => {
      await voteClient.deployContract();
    });
    it("should start with no winner", async () => {
      const winner = await getWinner();
      assert.equal(winner, 0);
    }) 
    it("should allow vote", async() =>{
      const allowVote = await getAllowVote();
      assert.equal(allowVote, 1);
    }) 
    it("should candidate 1 win", async () => {
      await execMethod("vote-for-candidate1");
      assert.equal(await getWinner(), 1);
      
    })
    it("should candidate 2 win", async () => {
        await execMethod("vote-for-candidate2");
        await execMethod("vote-for-candidate2");

        assert.equal(await getWinner(), 2);        
    })    

    it("should end with no winner", async () => {
        await execMethod("vote-for-candidate2");
        await execMethod("vote-for-candidate1");

        assert.equal(await getWinner(), 2);        
    })    
    it("should close vote", async () =>{
      await execMethod("close-vote");

      assert.equal(await getAllowVote(), 0);        
    })
    it("should not increase vote", async () => {
      //Candidate1 = 2 votes, Candidate2 = 3 Votes
      await execMethod("vote-for-candidate1");
      await execMethod("vote-for-candidate1");
      
      assert.equal(await getWinner(), 2);     
    

    })
  });
  after(async () => {
    await provider.close();
  });
});

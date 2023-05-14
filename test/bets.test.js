const BetContract = artifacts.require('BetContract');
const web3 = require('web3');

contract('BetContract', (accounts) => {
    let betContract;

    beforeEach(async () => {
        betContract = await BetContract.new();
    });

    it('should register a user', async () => {
        await betContract.registerUser({ from: accounts[0] });
        const isUserRegistered = await betContract.registeredUsers(accounts[0]);
        assert.isTrue(isUserRegistered, 'User should be registered');
    });

    it('should create a bet', async () => {
        const question = 'Who will win the game?';
        const choices = ['Team A', 'Team B'];

        const tx = await betContract.createBet(question, choices, { from: accounts[0] });
        const betCreatedEvent = tx.logs[0];
        assert.equal(betCreatedEvent.event, 'BetCreated', 'Event should be BetCreated');
        assert.equal(betCreatedEvent.args.id, 0, 'Bet ID should be 0');
        assert.equal(betCreatedEvent.args.question, question, 'Question should match');
        assert.deepEqual(betCreatedEvent.args.choices, choices, 'Choices should match');

        const totalBets = await betContract.totalBets();
        assert.equal(totalBets, 1, 'Total bets should be 1');
    });

    it('should place a bet', async () => {
        const betId = 0;
        const choice = 0;
        const amount = web3.utils.toWei('1', 'ether');

        await betContract.registerUser({ from: accounts[0] });
        await betContract.createBet('Who will win?', ['Option A', 'Option B'], {
            from: accounts[0],
        });

        const tx = await betContract.placeBet(betId, choice, { from: accounts[0], value: amount });
        const betPlacedEvent = tx.logs[0];
        assert.equal(betPlacedEvent.event, 'BetPlaced', 'Event should be BetPlaced');
        assert.equal(betPlacedEvent.args.betId, betId, 'Bet ID should match');
        assert.equal(betPlacedEvent.args.bettor, accounts[0], 'Bettor address should match');
        assert.equal(betPlacedEvent.args.choice, choice, 'Choice should match');
        assert.equal(betPlacedEvent.args.amount.toString(), amount, 'Amount should match');
    });

    it('should declare a winner and distribute winnings', async () => {
        const betId = 0;
        const winningChoice = 0;
        const amount = web3.utils.toWei('1', 'ether');

        await betContract.registerUser({ from: accounts[0] });
        await betContract.createBet('Who will win?', ['Option A', 'Option B'], {
            from: accounts[0],
        });
        await betContract.placeBet(betId, winningChoice, { from: accounts[0], value: amount });

        const initialBalance = await web3.eth.getBalance(accounts[0]);

        const tx = await betContract.declareWinner(betId, winningChoice, { from: accounts[0] });

        const betWinnerDeclaredEvent = tx.logs[0];
        assert.equal(
            betWinnerDeclaredEvent.event,
            'BetWinnerDeclared',
            'Event should be BetWinnerDeclared',
        );
        assert.equal(betWinnerDeclaredEvent.args.betId, betId, 'Bet ID should match');
        assert.equal(
            betWinnerDeclaredEvent.args.winningChoice,
            winningChoice,
            'Winning choice should match',
        );

        const finalBalance = await web3.eth.getBalance(accounts[0]);
        const winnings = await betContract.winnings(accounts[0]);

        const expectedFinalBalance = initialBalance.add(new BN(amount));
        assert.equal(
            finalBalance.toString(),
            expectedFinalBalance.toString(),
            'Final balance should match',
        );

        const expectedWinnings = new BN(amount);
        assert.equal(winnings.toString(), expectedWinnings.toString(), 'Winnings should match');
    });
});

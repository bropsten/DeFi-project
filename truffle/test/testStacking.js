const staking = artifacts.require("./Staking.sol");
const reward = artifacts.require("./BROToken.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');
const { advanceBlock } = require('@openzeppelin/test-helpers/src/time');
const { expect } = require('chai');
const Web3 = require ('web3');

contract('staking', accounts =>{


    const owner = accounts[0];
    const staker = accounts[1];

    let stakingInstance;
    let rewardInstance;
    let _stakeAm,_rewardAddr; 

    /* :::::::::::::::::::::::::::::::::::: Test de la Fonction stake ::::::::::::::::::::::::::::::*/

    describe("Test du contrat reward", function(){
        
        beforeEach(async function (){
            rewardInstance = await reward.new({from : owner});
        });
        //vérifier après avoir déployer le contract reward que celui-ci comporte bien 1M de tokens
        it('Sould mint 1Million token', async () => {
            const storedata = await rewardInstance.totalSupply({from : owner});
            console.log(storedata);
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (1000000));
        });

    });

    describe("Test du constructor", function(){
        beforeEach(async function (){
            rewardInstance = await reward.new({from : owner});
            const rewardAddr = rewardInstance.address;
            stakingInstance = await staking.new(rewardAddr,rewardAddr,{from : owner});
            
        });
    
        it('should reward token is equal to ERC20 rewardtoken address', async () => {
            const addr = await stakingInstance.rewardsToken({from : owner});
            const rewardAddr = rewardInstance.address;
            expect(addr).to.be.equal(rewardAddr);
        });

        it('should staking token is equal to ERC20 rewardtoken address', async () => {
            const addr = await stakingInstance.stakingToken({from : owner});
            const rewardAddr = rewardInstance.address;
            expect(addr).to.be.equal(rewardAddr);
        });

    });

    describe("Test de la fonction stake", function(){ 
        _stakeAm = new BN (web3.utils.toWei ("1000", "ether"));

        beforeEach(async function () {
            rewardInstance = await reward.new({from : owner});
            _rewardAddr = rewardInstance.address;
            stakingInstance = await staking.new(_rewardAddr,_rewardAddr,{from : owner});
            await rewardInstance.approve(stakingInstance.address,_stakeAm);
            await stakingInstance.stake(_stakeAm, false, {from : owner});
        });

        it('Should the function stake with success the amount', async () => {
            const storedata = await stakingInstance.totalSupply({from : owner});
            console.log(storedata);
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (1000));
        });

        it('Should the staking of user had growth from 1000', async () => {
            const storedata = await stakingInstance.balances(owner,{from : owner});
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (1000));
        });

        it('Should emit address & amount of the staking', async () => {
            await rewardInstance.approve(stakingInstance.address,(_stakeAm));
            expectEvent(await stakingInstance.stake(_stakeAm, {from : owner}), 'Stake',{user : owner, amount : _stakeAm});
        });
        /* Voir pour traiter les error si possible sinon laisser de côté

        it('Should revert error TransferFailed', async () => { 
            await expectRevert(stakingInstance.TransferFailed("",{from : owner}));

        });*/

    });
/* :::::::::::::::::::::::::::::::::::: Test de la Fonction withdraw ::::::::::::::::::::::::::::::*/
    describe("Test de la fonction withdraw", function(){ 
        _stakeAm = new BN (web3.utils.toWei ("1000", "ether"));

        beforeEach(async function (){
            rewardInstance = await reward.new({from : owner});
            _rewardAddr = rewardInstance.address;
            stakingInstance = await staking.new(_rewardAddr,_rewardAddr,{from : owner});
            await rewardInstance.approve(stakingInstance.address,_stakeAm);
            await stakingInstance.stake(_stakeAm, false, {from : owner});
            await stakingInstance.withdraw(web3.utils.toWei("500","ether"));
        });

        it('Should the function can withdraw', async () => {
            const storedata = await stakingInstance.totalSupply({from : owner});
            console.log(storedata);
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (500));
        });

        it('Should the staking of user have decreasing from 500', async () => {
            const storedata = await stakingInstance.balances(owner,{from : owner});
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (500));
        });

        it('Should emit address & amount of the withdraw', async () => {
            const storedata = await stakingInstance.balances(owner,{from : owner});
            expectEvent(await stakingInstance.withdraw(storedata, {from : owner}), 'WithdrawStake',{user : owner, amount : storedata});
        });
    });

    /* :::::::::::::::::::::::::::::::::::: Test de la Fonction earned ::::::::::::::::::::::::::::::*/
    describe("Test de la fonction RewardPerToken", function() {
        _stakeAm = new BN (web3.utils.toWei ("1000", "ether"));
        beforeEach(async function (){
            rewardInstance = await reward.new({from : owner});
            _rewardAddr = rewardInstance.address;
            stakingInstance = await staking.new(_rewardAddr,_rewardAddr,{from : owner});
            await rewardInstance.approve(stakingInstance.address,_stakeAm);
            await stakingInstance.stake(_stakeAm,{from : owner});

        });
        //Pas de calcul de token dans les rewards
        it('Should return the number of token rewarded after 1 day', async () => {
            await time.increase(time.duration.days(1));
            await stakingInstance.rewardPerToken({from : owner});
            const storedata = await stakingInstance.s_rewards(owner, {from : owner}); 
            console.log (storedata);
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (86));
        });

        it('Should return the number of token rewarded after 1 year', async () => {
            await time.increase(time.duration.years(1));
            await stakingInstance.rewardPerToken({from : owner});
            const storedata = await stakingInstance.s_rewards(owner, {from : owner}); 
            console.log (storedata);
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (31390));
        });

    });



});

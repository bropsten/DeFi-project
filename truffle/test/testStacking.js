const staking = artifacts.require("./Staking.sol");
const reward = artifacts.require("./RewardToken.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { assertion } = require('@openzeppelin/test-helpers/src/expectRevert');
const { expect } = require('chai');
const Web3 = require ('Web3');

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
            const addr = await stakingInstance.s_rewardsToken({from : owner});
            const rewardAddr = rewardInstance.address;
            expect(addr).to.be.equal(rewardAddr);
        });

        it('should staking token is equal to ERC20 rewardtoken address', async () => {
            const addr = await stakingInstance.s_stakingToken({from : owner});
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
            await stakingInstance.stake(_stakeAm,{from : owner});
        });

        it('Should the function stake with success the amount', async () => {
            const storedata = await stakingInstance.s_totalSupply({from : owner});
            console.log(storedata);
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (1000));
        });

        it('Should the staking of user had growth from 1000', async () => {
            const storedata = await stakingInstance.s_balances(owner,{from : owner});
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (1000));
        });

        it('Should emit address & amount of the staking', async () => {
            await rewardInstance.approve(stakingInstance.address,(_stakeAm));
            expectEvent(await stakingInstance.stake(_stakeAm, {from : owner}), 'Staked',{user : owner, amount : _stakeAm});
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
            await stakingInstance.stake(_stakeAm,{from : owner});
            await stakingInstance.withdraw(web3.utils.toWei("500","ether"));
        });

        it('Should the function can wtihdraw', async () => {
            const storedata = await stakingInstance.s_totalSupply({from : owner});
            console.log(storedata);
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (500));
        });

        it('Should the staking of user have decreasing from 500', async () => {
            const storedata = await stakingInstance.s_balances(owner,{from : owner});
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.bignumber.equal(new BN (500));
        });

        it('Should emit address & amount of the withdraw', async () => {
            const storedata = await stakingInstance.s_balances(owner,{from : owner});
            expectEvent(await stakingInstance.withdraw(storedata, {from : owner}), 'WithdrewStake',{user : owner, amount : storedata});
        });
    });

    /* :::::::::::::::::::::::::::::::::::: Test de la Fonction earned ::::::::::::::::::::::::::::::*/
    describe("Test de la fonction Earned", function() {
        _stakeAm = new BN (web3.utils.toWei ("1000", "ether"));
        beforeEach(async function (){
            rewardInstance = await reward.new({from : owner});
            _rewardAddr = rewardInstance.address;
            stakingInstance = await staking.new(_rewardAddr,_rewardAddr,{from : owner});
            await rewardInstance.approve(stakingInstance.address,_stakeAm);
            await stakingInstance.stake(_stakeAm,{from : owner});
        });
        //A refaire car soucis avec cette fonction
        it('Sould return the number of token earned', async () => {
            const storedata = await stakingInstance.earned(owner,{from : owner});
            expect(new BN (web3.utils.fromWei (storedata, "ether"))).to.be.equal(new BN (1000));
        });
        //Test de la fonction rewardPerToken à terminer 
        it('Should rewardPerToken test', async () => {
            const storedata = await stakingInstance.s_balances(owner,{from : owner});
            await stakingInstance.withdraw(storedata, {from : owner})
            expect()
        });
    });



});
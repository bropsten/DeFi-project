# Projet 4 - DApp de staking

### Lien Heroku
https://vast-brook-64708.herokuapp.com/

### Vidéo de présentation
- Presentation du front
https://www.loom.com/share/f4757782119e414ca6ed19267adf403f

- Presentation du back React part 1
https://www.loom.com/share/fae72c49c8044d829e80329505373939


### Objectifs
- [x] Staker un ou plusieurs ERC20 dans des pools de cet ERC20
- [x] ERC20 préexistants (valeur existante face à ETH ou USDC) ou créés pour l'occasion (faucet)
- [x] Unstake de ses tokens (avec ou sans condition de temps, en partie ou totalité)
- [x] Générer une récompense (via un token de récompense, de l'ETH ou autre token)
- [x] La quantité de la récompense doit être proportionnelle à la valeur bloquées sur le smart contract 
- [x] Projet à rendre sous la forme d'une DApp, front, smart contract,
- [x] Tests unitaires
### Bonus
- [ ] Pouvoir créer à la volée des pools de liquidités par paires
- [x] Récompenser l'utilisateur de la manière que l'on souhaite (token de récompense, minté pour les récompenses sur l'ensemble de pools)
- [x] Calculer de manière logique la récompense reçue par l'utilisateur (temps dans la pool, part dans l'ensemble des pools, quantité retirée, ...). Faire des maths
- [x] Calculer la valeur des assets stakés (part dans l'ensemble des pools) à la même unité de valeur, en stable ou en ETH.
- [x] Pour les ERC20 créés, définir un taux de change arbitraire, pour les ERC20 pré existants, utiliser un Oracle pour trouver leurs valeurs face à l'ETH ou un stablecoin
___

## Récupérer le projet
```bash
git clone git@github.com:bropsten/DeFi-project.git
```

Staking : Locking tokens to net rewards

## Installation des librairies
```bash
cd truffle 
npm install

cd client
npm install
```
___

### Truffle test

Contract: staking

    Test du contrat reward
      √ Sould mint 1Million token (118ms)
    Test du constructor
      √ should reward token is equal to ERC20 rewardtoken address (122ms)
      √ should staking token is equal to ERC20 rewardtoken address (97ms)
    Test de la fonction stake
      √ Should the function stake with success the amount (80ms)
      √ Should the staking of user had growth from 1000 (137ms)
      √ Should emit address & amount of the staking (1453ms, 149933 gas)
      √ Should revert stake amount need to be more than 0 (1372ms, 75505 gas)
      √ Should revert transfert failed (1877ms, 195191 gas)
    Test de la fonction withdraw
      √ Should the function can withdraw (136ms)
      √ Should the staking of user have decreasing from 500 (148ms)
      √ Should emit address & amount of the withdraw (955ms, 37934 gas)
      √ Should revert withdraw balance need to be more than 0 (414ms, 44952 gas)
    Test de la fonction RewardPerToken
      √ Should return the number of token rewarded after 1 day (1084ms, 88468 gas)
    Test de la fonction claimReward
      √ Should return the number of token rewarded after 1 day (864ms, 102609 gas)
      
### Chainlink Pair used in the project
The DAI / USD pair
Rinkeby : 0x2bA49Aaa16E6afD2a993473cfB70Fa8559B523cF


### ETH Gas Reporter

![ETH Gas Reporter](https://github.com/bropsten/DeFi-project/blob/main/truffle/images/ethgas2.jpg)

### Solidity Coverage 

![Solidity Coverage](https://github.com/bropsten/DeFi-project/blob/main/truffle/images/coverage.jpg)

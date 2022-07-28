# Projet 4 - DApp de staking

### Objectifs
- [ ] Staker un ou plusieurs ERC20 dans des pools de cet ERC20
- [ ] ERC20 préexistants (valeur existante face à ETH ou USDC) ou créés pour l'occasion (faucet)
- [ ] Unstake de ses tokens (avec ou sans condition de temps, en partie ou totalité)
- [ ] Générer une récompense (via un token de récompense, de l'ETH ou autre token)
- [ ] La quantité de la récompense doit être proportionnelle à la valeur bloquées sur le smart contract 
- [ ] Projet à rendre sous la forme d'une DApp, front, smart contract, tests unitaires
### Bonus
- [ ] Pouvoir créer à la volée des pools de liquidités par paires
- [ ] Récompenser l'utilisateur de la manière que l'on souhaite (token de récompense, minté pour les récompenses sur l'ensemble de pools)
- [ ] Calculer de manière logique la récompense reçue par l'utilisateur (temps dans la pool, part dans l'ensemble des pools, quantité retirée, ...). Faire des maths
- [ ] Calculer la valeur des assets stakés (part dans l'ensemble des pools) à la même unité de valeur, en stable ou en ETH.
- [ ] Pour les ERC20 créés, définir un taux de change arbitraire, pour les ERC20 pré existants, utiliser un Oracle pour trouver leurs valeurs face à l'ETH ou un stablecoin
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
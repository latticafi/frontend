export interface Token {
	symbol: string;
	name: string;
	color: string;
}

export interface Vault {
	id: string;
	name: string;
	curator: string;
	asset: Token;
	totalSupply: string;
	apy: number;
	collateralTokens: Token[];
}

export interface User {
	id: number;
	name: string;
	email: string;
	createdAt: string | null;
}

export interface Market {
	id: string;
	slug: string;
	collateralName: string;
	collateralAddress: string;
	collateralImage?: string;
	loanAsset: Token;
	lltv: number;
	resolutionDate: string;
	totalMarketSize: string;
	totalMarketSizeUsd: string;
	availableLiquidity: string;
	availableLiquidityUsd: string;
	rate24h: number;
	poolClosure: string;
	currentRate: number;
	source: "Polymarket";
}

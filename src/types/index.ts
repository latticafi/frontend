export interface Token {
	symbol: string;
	name: string;
	color: string;
}

export interface User {
	id: number;
	walletAddress: string;
	name: string | null;
	email: string | null;
	createdAt: string | null;
}

export interface Market {
	conditionId: string;
	tokenId: string;
	minLtvBps: number;
	maxLtvBps: number;
	resolutionTime: string;
	originationCutoff: string;
	active: boolean;
	name: string | null;
	description: string | null;
	imageUrl: string | null;
	category: string | null;
}

export interface PriceData {
	conditionId: string;
	bid: number;
	ask: number;
	mid: number;
	updatedAt: number;
}

export interface PoolSnapshot {
	totalAssets: string;
	totalBorrowed: string;
	availableLiquidity: string;
	utilization: string;
	sharePrice: string;
	currentRate: string;
	maintenanceMargin: string;
	reserveBalance: string;
	reserveHealthy: boolean;
	controllerCircuitBroken: boolean;
	paused: boolean;
	totalLoans: string;
}

export interface LenderBalance {
	shares: string;
	value: string;
}

export interface QuoteBreakdown {
	basePremiumBps: number;
	volMultiplier: number;
	premiumFloorApplied: boolean;
	wangLambda: number;
	physicalVar01: number;
	wangVar01: number;
	maxPositionUsdc: number;
	liquidityCostBps: number;
}

export interface PriceAttestation {
	conditionId: string;
	price: string;
	timestamp: number;
	deadline: number;
	signature: string;
}

export interface QuoteResponse {
	premiumBps: number;
	amount: number;
	collateralAmount: number;
	epochLength: number;
	deadline: number;
	nonce: number;
	signature: string;
	breakdown: QuoteBreakdown;
	priceAttestation: PriceAttestation;
}

export interface QuoteRejection {
	rejected: true;
	reason: string;
	maxPositionUsdc: number;
}

export interface Loan {
	loanId: number;
	borrower: string;
	conditionId: string;
	tokenId: string;
	collateralAmount: string;
	principal: string;
	premiumPaid: string;
	interestDue: string;
	interestRateBps: number;
	liquidationPrice: string;
	epochStart: number;
	epochEnd: number;
	status: string;
	healthFactor: number | null;
}

export interface HistoryEvent {
	type: "deposit" | "withdraw" | "loan";
	txHash: string;
	blockNumber: number;
	data: Record<string, unknown>;
	createdAt: string | null;
}

export interface ApprovalStatus {
	usdc: {
		allowance: string;
		sufficient: boolean;
	};
	ctf: {
		approved: boolean;
	};
}

export interface TxResponse {
	to: string;
	data: string;
}

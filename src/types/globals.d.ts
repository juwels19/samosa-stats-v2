export {};

// Create a type for the roles
export type Roles = "admin" | "user";

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

export type RankingData = {
  [key: string]: {
    totalPoints: number;
    positiveBonusPoints: number;
    negativeBonusPoints: number;
    fullName: string;
    medalCounts: {
      gold: number;
      silver: number;
      bronze: number;
    };
  };
};

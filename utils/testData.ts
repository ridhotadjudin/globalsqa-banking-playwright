export const APP_LOGIN_PATH = "/angularJs-protractor/BankingProject/#/login";

export const CUSTOMERS = {
  harryPotter: "Harry Potter",
  hermione: "Hermoine Granger",
  ronWeasly: "Ron Weasly",
  albus: "Albus Dumbledore",
  neville: "Neville Longbottom",
} as const;

export const DEFAULT_CUSTOMER = CUSTOMERS.harryPotter;

export const AMOUNTS = {
  standardDeposit: "100",
  standardWithdrawal: "50",
  largeDeposit: "5000",
  zero: "0",
} as const;

export const TRANSACTION_TYPES = {
  credit: "Credit",
  debit: "Debit",
} as const;
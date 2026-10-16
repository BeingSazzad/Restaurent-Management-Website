export interface TransactionRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentMethod: 'apple_pay' | 'card' | 'cash';
  methodLabel: string;
  status: 'settled' | 'pending' | 'refunded';
  timestamp: string;
  cardLast4?: string;
  terminalRef?: string;
}

const TRANSACTIONS_STORAGE_KEY = 'amber_spice_transactions';

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'TXN-90214',
    orderNumber: 'ZM-4047',
    customerName: 'Mark Jecno',
    customerEmail: 'mark.jecno@gmail.com',
    amount: 16.99,
    paymentMethod: 'apple_pay',
    methodLabel: 'Apple Pay (Tokenized)',
    status: 'settled',
    timestamp: '2026-10-16T17:45:00Z',
    terminalRef: 'STRIPE_IE_99182',
  },
  {
    id: 'TXN-90213',
    orderNumber: 'AS-2041',
    customerName: 'Sarah Ahmed',
    customerEmail: 'sarah.ahmed@dublin.ie',
    amount: 36.87,
    paymentMethod: 'apple_pay',
    methodLabel: 'Apple Pay (Tokenized)',
    status: 'settled',
    timestamp: '2026-10-16T17:36:00Z',
    terminalRef: 'STRIPE_IE_99175',
  },
  {
    id: 'TXN-90212',
    orderNumber: 'AS-2042',
    customerName: 'James Miller',
    customerEmail: 'james.m@outlook.com',
    amount: 13.50,
    paymentMethod: 'card',
    methodLabel: 'Visa Card •• 4242',
    status: 'settled',
    timestamp: '2026-10-16T17:28:00Z',
    cardLast4: '4242',
    terminalRef: 'STRIPE_IE_99160',
  },
  {
    id: 'TXN-90211',
    orderNumber: 'AS-2039',
    customerName: 'Aoife Kelly',
    customerEmail: 'aoife.kelly@tcd.ie',
    amount: 52.40,
    paymentMethod: 'card',
    methodLabel: 'Mastercard •• 8821',
    status: 'settled',
    timestamp: '2026-10-16T16:15:00Z',
    cardLast4: '8821',
    terminalRef: 'STRIPE_IE_99142',
  },
  {
    id: 'TXN-90210',
    orderNumber: 'AS-2038',
    customerName: 'Conor Murphy',
    customerEmail: 'conor.murphy@eircom.net',
    amount: 28.99,
    paymentMethod: 'cash',
    methodLabel: 'Cash on Delivery',
    status: 'settled',
    timestamp: '2026-10-16T15:20:00Z',
    terminalRef: 'POS_CASH_TILL_1',
  },
  {
    id: 'TXN-90209',
    orderNumber: 'AS-2035',
    customerName: 'Dr. Declan Byrne',
    customerEmail: 'declan.byrne@stjames.ie',
    amount: 44.00,
    paymentMethod: 'apple_pay',
    methodLabel: 'Apple Pay (Tokenized)',
    status: 'settled',
    timestamp: '2026-10-16T14:40:00Z',
    terminalRef: 'STRIPE_IE_99110',
  },
  {
    id: 'TXN-90208',
    orderNumber: 'AS-2031',
    customerName: 'Liam O’Flaherty',
    customerEmail: 'liam.oflaherty@ucd.ie',
    amount: 21.50,
    paymentMethod: 'card',
    methodLabel: 'Visa Card •• 1098',
    status: 'settled',
    timestamp: '2026-10-16T13:10:00Z',
    cardLast4: '1098',
    terminalRef: 'STRIPE_IE_99092',
  },
];

export function getTransactionsList(): TransactionRecord[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  try {
    const raw = localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(INITIAL_TRANSACTIONS));
      return INITIAL_TRANSACTIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fallback
  }
  return INITIAL_TRANSACTIONS;
}

export function saveTransactionsList(txns: TransactionRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify(txns));
    window.dispatchEvent(new Event('amber_spice_transactions_updated'));
  } catch (err) {
    console.error('Failed to save transactions list:', err);
  }
}

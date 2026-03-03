const EXPLORER_BASE = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://sepolia.voyager.online";

export function getTxUrl(hash: string): string {
  return `${EXPLORER_BASE}/tx/${hash}`;
}

export function getAddressUrl(address: string): string {
  return `${EXPLORER_BASE}/contract/${address}`;
}

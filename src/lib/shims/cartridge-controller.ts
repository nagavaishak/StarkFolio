// Empty shim for @cartridge/controller (optional peer dependency of starkzap).
// We don't use Cartridge — only Privy integration. This prevents bundler errors.

export default class Controller {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(..._args: any[]) {
    throw new Error("Cartridge Controller is not supported in this app.");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toSessionPolicies(..._args: any[]): any {
  return [];
}

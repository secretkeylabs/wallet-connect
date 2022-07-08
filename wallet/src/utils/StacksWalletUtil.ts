import StacksLib from '@/lib/StacksLib'

export let wallet1: StacksLib
export let wallet2: StacksLib
export let stacksWallets: Record<string, StacksLib>
export let stacksAddresses: string[]

let address1: string
let address2: string

/**
 * Utilities
 */
export async function createOrRestoreStacksWallet() {
  const secretKey1 = localStorage.getItem('STACKS_SECRET_KEY_1')
  const secretKey2 = localStorage.getItem('STACKS_SECRET_KEY_2')

  if (secretKey1 && secretKey2) {
    const secretArray1: number[] = Object.values(JSON.parse(secretKey1))
    const secretArray2: number[] = Object.values(JSON.parse(secretKey2))
    wallet1 = StacksLib.init({ secretKey: Uint8Array.from(secretArray1) })
    wallet2 = StacksLib.init({ secretKey: Uint8Array.from(secretArray2) })
  } else {
    wallet1 = StacksLib.init({})
    wallet2 = StacksLib.init({})

    // // Don't store secretKey in local storage in a production project!
    // localStorage.setItem(
    //   'STACKS_SECRET_KEY_1',
    //   JSON.stringify(Array.from(wallet1.keypair.secretKey))
    // )
    // localStorage.setItem(
    //   'STACKS_SECRET_KEY_2',
    //   JSON.stringify(Array.from(wallet2.keypair.secretKey))
    // )
  }

  address1 = await wallet1.getAddress()
  address2 = await wallet2.getAddress()

  stacksWallets = {
    [address1]: wallet1,
    [address2]: wallet2
  }
  stacksAddresses = Object.keys(stacksWallets)

  return {
    stacksWallets,
    stacksAddresses
  }
}

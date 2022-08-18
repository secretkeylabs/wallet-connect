import { getWalletAddressFromParams } from '@/utils/HelperUtil'
import { stacksAddresses, stacksWallets } from '@/utils/StacksWalletUtil'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'

import {
  STACKS_DEFAULT_METHODS
} from "@web3devs/stacks-wallet-connect";

export async function approveStacksRequest(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  const { params, id } = requestEvent
  const { request } = params
  const wallet = stacksWallets[getWalletAddressFromParams(stacksAddresses, params)]

  switch (request.method) {
    case STACKS_DEFAULT_METHODS.SIGN_MESSAGE:
      const signedMessage = await wallet.signMessage(request.params.message)
      return formatJsonRpcResult(id, signedMessage)

    case STACKS_DEFAULT_METHODS.STX_TRANSFER:
      const stxTransferTxn = await wallet.stxTransfer(request.params)

      return formatJsonRpcResult(id, stxTransferTxn)

    case STACKS_DEFAULT_METHODS.CONTRACT_CALL:
      const contractCallTxn = await wallet.contractCall(request.params)

      return formatJsonRpcResult(id, contractCallTxn)

    default:
      throw new Error(getSdkError('INVALID_METHOD').message)
  }
}

export function rejectStacksRequest(request: SignClientTypes.EventArguments['session_request']) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED_METHODS').message)
}

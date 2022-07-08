import { STACKS_SIGNING_METHODS } from '@/data/StacksData'
import { getWalletAddressFromParams } from '@/utils/HelperUtil'
import { stacksAddresses, stacksWallets } from '@/utils/StacksWalletUtil'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { SignClientTypes } from '@walletconnect/types'
import { ERROR } from '@walletconnect/utils'

export async function approveStacksRequest(
  requestEvent: SignClientTypes.EventArguments['session_request']
) {
  const { params, id } = requestEvent
  const { request } = params
  const wallet = stacksWallets[getWalletAddressFromParams(stacksAddresses, params)]

  switch (request.method) {
    case STACKS_SIGNING_METHODS.STACKS_SIGN_MESSAGE:
      const signedMessage = await wallet.signMessage(request.params.message)
      return formatJsonRpcResult(id, signedMessage)

    case STACKS_SIGNING_METHODS.STACKS_STX_TRANSFER:
      const stxTransferTxn = await wallet.stxTransfer(request.params)

      return formatJsonRpcResult(id, stxTransferTxn)

    case STACKS_SIGNING_METHODS.STACKS_CONTRACT_CALL:
      const contractCallTxn = await wallet.contractCall(request.params)

      return formatJsonRpcResult(id, contractCallTxn)

    default:
      throw new Error(ERROR.UNKNOWN_JSONRPC_METHOD.format().message)
  }
}

export function rejectStacksRequest(request: SignClientTypes.EventArguments['session_request']) {
  const { id } = request

  return formatJsonRpcError(id, ERROR.JSONRPC_REQUEST_METHOD_REJECTED.format().message)
}

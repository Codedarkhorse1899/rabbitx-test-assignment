import { Centrifuge } from 'centrifuge'
import { WS_ENDPOINT, JWT_TOKEN } from '@/constants/wss'

const centrifuge = new Centrifuge(WS_ENDPOINT)
centrifuge.setToken(JWT_TOKEN)

export {
  type Centrifuge,
  type ConnectedContext,
  type ConnectingContext,
  type DisconnectedContext,
  type SubscribedContext,
  type PublicationContext,
  type UnsubscribedContext,
  type ErrorContext,
  State as ConnState,
  SubscriptionState
} from 'centrifuge'
export default centrifuge

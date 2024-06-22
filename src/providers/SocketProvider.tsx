import { createContext, useCallback, useEffect, useState } from "react"

import centrifuge, {
  ConnectedContext,
  ConnState,
  SubscribedContext,
  PublicationContext,
  UnsubscribedContext,
  ErrorContext,
  SubscriptionState
} from '@/utils/wss'
import toast from "@/utils/toast"
import { SYMBOLS } from "@/constants/symbol"

type Orderbook = {
  market_id: typeof SYMBOLS[number];
  bids: [string, string][];
  asks: [string, string][];
  sequence: number;
  timestamp: number;
}

type SocketContextProps = {
  clientID: string; // Socket client id
  orderbooks: Orderbook[]; // Global orderbook array
  connState: ConnState; // Connection state
}

type SocketProviderProps = {
  children: React.ReactNode
}

const SocketContext = createContext<SocketContextProps>({
  clientID: '',
  orderbooks: [],
  connState: ConnState.Disconnected,
})

function SocketProvider({ children }: SocketProviderProps) {
  const [connState, setConnState] = useState<ConnState>(ConnState.Disconnected)
  const [orderbooks, setOrderbooks] = useState<Orderbook[]>([])
  const [clientID, setClientID] = useState<string>('')

  /**
   * Unsubscribe from a specific orderbook channel
   * @param symbol - specific symbol to indicate orderbook channel to be unsubscribed
  */
  const unsubscribeChannel = useCallback((symbol: string) => {
    const subscription = centrifuge.getSubscription(`orderbook:${symbol}`)
    if (subscription && subscription.state !== SubscriptionState.Unsubscribed) {
      subscription.unsubscribe()
      subscription.removeAllListeners()
      centrifuge.removeSubscription(subscription)
    }
  }, [])

  /**
   * Unsubscribe from all the public orderbook channels
  */
  const unsubscribeChannels = useCallback(() => {
    SYMBOLS.forEach(symbol => {
      unsubscribeChannel(symbol)
    })
  }, [unsubscribeChannel])

  /**
   * Subscribe to the specific orderbook channel
   * @param symbol - specific symbol to indicate orderbook channel to be subscribed
   */
  const subscribeChannel = useCallback((symbol: string) => {
    const subscription = centrifuge.getSubscription(`orderbook:${symbol}`)
      || centrifuge.newSubscription(`orderbook:${symbol}`)
    if (subscription && subscription.state === SubscriptionState.Unsubscribed) {
      subscription.on('subscribed', (context: SubscribedContext) => {
        toast.success(`Subscribed to ${context.channel} channel!`)
        setOrderbooks(orderbooks => [...orderbooks, context.data])
      })
      subscription.on('publication', (context: PublicationContext) => {
        // Checks whether there are skipped sequences or not
        const lastSequence = orderbooks.filter(item => item.market_id === symbol).reverse()[0]
        if (context.data.sequence === lastSequence.sequence + 1) {
          setOrderbooks(orderbooks => [...orderbooks, context.data])
        } else {
          toast.error('Sequence missed!')
          unsubscribeChannel(symbol)
          subscribeChannel(symbol)
        }
      })
      subscription.on('unsubscribed', (context: UnsubscribedContext) => {
        toast.warning(`Unsubscribed to ${context.channel} channel!`)
        setOrderbooks(() => [])
      })

      subscription.subscribe()
    }
  }, [orderbooks, unsubscribeChannel])

  /**
   * Subscribe to all the public orderbook channels
  */
  const subscribeChannels = useCallback(() => {
    SYMBOLS.forEach(symbol => {
      subscribeChannel(symbol)
    })
  }, [subscribeChannel])

  /**
   * Add event listeners to the client websocket (e.g. 'connected', 'connecting', 'disconnected')
  */
  const addSocketListener = useCallback(() => {
    centrifuge.on(ConnState.Connected, (context: ConnectedContext) => {
      setConnState(ConnState.Connected)
      setClientID(context.client)
    })
    centrifuge.on(ConnState.Connecting, () => {
      setConnState(ConnState.Connecting)
    })
    centrifuge.on(ConnState.Disconnected, () => {
      setConnState(ConnState.Disconnected)
      setClientID('')
      unsubscribeChannels()
    })
    centrifuge.on('error', (context: ErrorContext) => {
      const { code } = context.error
      if (code === 2) {
        setConnState(ConnState.Disconnected)
      }
    })
  }, [unsubscribeChannels])

  /**
   * Remove event listeners from the client websocket
  */
  const removeSocketListener = () => {
    centrifuge.removeAllListeners()
  }

  useEffect(() => {
    if (centrifuge) {
      addSocketListener()
      subscribeChannels()
      centrifuge.connect()
    }

    return () => {
      unsubscribeChannels()
      removeSocketListener()
      centrifuge.disconnect()
    }
  }, [addSocketListener, subscribeChannels, unsubscribeChannels])

  useEffect(() => {
    if (connState === ConnState.Connected) {
      toast.success('Connected!')
    } else if (connState === ConnState.Connecting) {
      toast.info('Connecting...')
    } else {
      toast.error('Disconnected!')
    }
  }, [connState])

  return <SocketContext.Provider value={{ clientID, connState, orderbooks }}>
    {children}
  </SocketContext.Provider>
}

export { type Orderbook, SocketContext }
export default SocketProvider
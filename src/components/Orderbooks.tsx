import { useContext, useState } from "react"

import SymbolOrderbook from "@/components/SymbolOrderbook"
import { SocketContext } from "@/providers/SocketProvider"
import { SYMBOLS } from "@/constants/symbol"
import { BID_ITEM_COUNT, ASK_ITEM_COUNT } from "@/constants/ui"

const Orderbooks = () => {
  const { orderbooks } = useContext(SocketContext)
  const [bidsCount, setBidsCount] = useState<number>(BID_ITEM_COUNT * 2)
  const [asksCount, setAsksCount] = useState<number>(BID_ITEM_COUNT * 2)

  /**
   * Returns array of price level, quantity, and running total of quantities for buyers by symbol.
   * @param symbol - Cryptocurrency type (e.g., BTC-USD or SOL-USD)
  */
  const getBidsBySymbol = (symbol: string) => {
    const bids = orderbooks.filter(item => item.market_id === symbol && item.bids && item.bids.length !== 0)
      .map(item => item.bids).flatMap((bids) => [...bids])
    const totBid = bids.reduce((tot, item) => tot + Number(item[1]), 0)
    return bids.reduce((tot: string[][], item: string[], idx: number) => {
      const item2 = (idx === 0 ? totBid : Number(tot[idx - 1][2]) - Number(item[1])).toFixed(4)
      return [
        ...tot,
        [item[0], item[1], item2]
      ]
    }, []).slice(-bidsCount)
  }

  /**
   * Returns array of price level, quantity, and running total of quantities for sellers by symbol.
   * @param symbol - Cryptocurrency type (e.g., BTC-USD or SOL-USD)
  */
  const getAsksBySymbol = (symbol: string) => {
    const asks = orderbooks.filter(item => item.market_id === symbol && item.asks && item.asks.length !== 0)
      .map(item => item.asks).flatMap((asks) => [...asks])
    return asks.reduce((tot: string[][], item: string[], idx: number) => {
      const item2 = (idx === 0 ? item[1] : (Number(tot[idx - 1][2]) + Number(item[1])).toFixed(4))
      return [
        ...tot,
        [item[0], item[1], item2]
      ]
    }, []).slice(-asksCount)
  }

  return <div className="flex gap-x-6 justify-center">
    {
      SYMBOLS.map((symbol: string, idx: number) =>
        <SymbolOrderbook
          key={idx}
          symbol={symbol}
          bids={getBidsBySymbol(symbol)}
          asks={getAsksBySymbol(symbol)}
          loadBidsMore={() => setBidsCount(bidsCount => bidsCount + BID_ITEM_COUNT)}
          loadAsksMore={() => setAsksCount(asksCount => asksCount + ASK_ITEM_COUNT)}
        />)
    }
  </div>
}

export default Orderbooks
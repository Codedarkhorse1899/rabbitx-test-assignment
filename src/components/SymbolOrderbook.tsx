import { useEffect, useRef } from "react";

type SymbolOrderbookProps = {
  symbol: string;
  bids: string[][];
  asks: string[][];
  loadBidsMore: () => void; // Use this callback to load more bids when scroll to top
  loadAsksMore: () => void; // Use this callback to load more asks when scroll to top
}

const SymbolOrderbook = ({
  symbol, bids, asks, loadBidsMore, loadAsksMore
}: SymbolOrderbookProps) => {
  const cryptoUnit = symbol.split('-')[0] || '' // BTC or SOL
  const bidWidget = useRef<HTMLDivElement>(null)
  const askWidget = useRef<HTMLDivElement>(null)

  /**
   * Scroll bottom of the bids widget to show the latest data
  */
  const scrollBidwidgetBottom = () => {
    if (bidWidget.current) {
      const targetNode = bidWidget.current
      targetNode.scrollTop = targetNode.scrollHeight
    }
  }

  /**
   * Scroll bottom of the asks widget to show the latest data
  */
  const scrollAskwidgetBottom = () => {
    if (askWidget.current) {
      const targetNode = askWidget.current
      targetNode.scrollTop = targetNode.scrollHeight
    }
  }

  useEffect(() => {
    const config = { childList: true }

    // Fetch load more bids callback when scrolls to the top of bids widget
    const handleBidScroll = () => {
      if (bidWidget.current?.scrollTop === 0) {
        loadBidsMore()
      }
    }
    // Fetch load more asks callback when scrolls to the top of asks widget
    const handleAskScroll = () => {
      if (askWidget.current?.scrollTop === 0) {
        loadAsksMore()
      }
    }

    if (bidWidget.current) {
      // Observe if the bid items are added
      const observer = new MutationObserver(() => {
        scrollBidwidgetBottom()
      })
      const targetNode = bidWidget.current
      observer.observe(targetNode, config)

      bidWidget.current.addEventListener('scroll', handleBidScroll)
    }
    if (askWidget.current) {
      // Observe if the ask items are added
      const observer = new MutationObserver(() => {
        scrollAskwidgetBottom()
      })
      const targetNode = askWidget.current
      observer.observe(targetNode, config)

      askWidget.current.addEventListener('scroll', handleAskScroll)
    }

    return () => {
      if (bidWidget.current) {
        bidWidget.current.removeEventListener('scroll', handleBidScroll)
      }
      if (askWidget.current) {
        askWidget.current.removeEventListener('scroll', handleAskScroll)
      }
    }
  }, [])

  return <div className="max-w-[400px] shrink-0 w-full flex flex-col">
    <p className="text-center mb-2 font-medium">{symbol}</p>
    <div className="">
      <div className="grid grid-cols-3 py-1">
        <div className="flex gap-x-1 items-center">
          <p className="text-primary-text font-medium">Price</p>
          <span className="rounded-md px-1 text-primary-text bg-primary-foreground text-xs">USD</span>
        </div>
        <div className="flex gap-x-1 items-center justify-end">
          <p className="text-primary-text font-medium">Amount</p>
          <span className="rounded-md px-1 text-primary-text bg-primary-foreground text-xs">{cryptoUnit}</span>
        </div>
        <div className="flex gap-x-1 items-center justify-end">
          <p className="text-primary-text font-medium">Total</p>
          <span className="rounded-md px-1 text-primary-text bg-primary-foreground text-xs">{cryptoUnit}</span>
        </div>
      </div>
      <div className="">
        <div className="h-full max-h-[200px] overflow-y-scroll pr-1" ref={bidWidget}>
          {bids.map((bid: string[], idx: number) =>
            <div key={idx} className="grid grid-cols-3 cursor-pointer group">
              <div className="text-red-500 text-sm group-hover:bg-red-500/30 group-hover:rounded-r-sm">{bid[0]}</div>
              <div className="text-secondary-text text-right text-sm">{bid[1]}</div>
              <div className="text-secondary-text text-right text-sm">{bid[2]}</div>
            </div>
          )}
        </div>
        <div className="h-8 rounded-md bg-secondary"></div>
        <div className="h-full max-h-[200px] overflow-y-scroll pr-1" ref={askWidget}>
          {asks.map((ask: string[], idx: number) =>
            <div key={idx} className="grid grid-cols-3 cursor-pointer group">
              <div className="text-green-500 text-sm group-hover:bg-green-500/30 group-hover:rounded-r-sm">{ask[0]}</div>
              <div className="text-secondary-text text-right text-sm">{ask[1]}</div>
              <div className="text-secondary-text text-right text-sm">{ask[2]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
}

export default SymbolOrderbook
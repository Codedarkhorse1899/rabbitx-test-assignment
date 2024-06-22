# Rabbitx Test Assignment

`Required Skills`
React, Typescript, Centrifuge

## Approach taken
I successfully established a WebSocket connection to the existing RabbitX WebSocket server using the Centrifuge library. This setup allowed me to implement real-time communication between the client and the server.
Next, I developed functionality for subscribing to and publishing messages on the WebSocket channel. This enabled the dynamic flow of data necessary for updating the order book interface in real time.
To display the order book UI, I combined the initial snapshot of data with the data published in real-time. However, this approach presented a significant challenge due to network instability and data packet loss. To address this, I implemented a strategy to resubscribe to the channel automatically whenever there was a network disruption, ensuring continuity in data updates.

## Challenge
One of the main technical challenges was managing the high velocity of incoming data, which was affecting the responsiveness and performance of the user interface. To mitigate this, I optimized the display logic by initially showing only the latest 10 records for both bids and asks. Additional records are then loaded as the user scrolls, enhancing UI performance without overwhelming it with too much data at once.

## Possible improvement
A potential area for improvement lies in the transport technology used for these connections. Currently, the Centrifuge server setup does not support HTTP streaming or Server-Sent Events (SSE), which can limit efficiency, particularly during reconnections. Optimizing reconnections with SSE, instead of relying solely on WebSockets, could significantly enhance performance by reducing the overhead involved in re-establishing connections and maintaining a low-latency communication channel.
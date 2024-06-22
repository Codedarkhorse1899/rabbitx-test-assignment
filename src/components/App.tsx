import Orderbooks from "@/components/Orderbooks"

const App = () => {
  return <div className="min-h-screen bg-primary flex flex-col items-center">
    <header className="flex flex-col items-center justify-center py-4">
      <h1 className="text-4xl font-bold">Orderbook</h1>
    </header>
    <main className="max-w-screen-2xl mx-auto">
      <Orderbooks />
    </main>
  </div>
}

export default App;
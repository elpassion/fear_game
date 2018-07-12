defmodule Fear.Game.Watcher do
  use GenServer
  alias Fear.Board

  def start_link(_) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    send(self(), :start)
    {:ok, []}
  end

  def handle_info(:start, state) do

    for i <- 0..15 do
      for j <- 5..20 do
        Board.add({i, j}, :field, {i + j*20, 1}, false)
      end
    end

    {:noreply, state}
  end

end

defmodule Fear.Game.Watcher do
  use GenServer
  alias Fear.{Board, Game, Users}
  require Logger

  @interval 500

  defp size() do
    Enum.min([Users.count() * 100 + 400, 2000])
  end

  def start_link() do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    send(self(), :start)
    Process.send_after(self(), :destroy_field, @interval)
    {:ok, []}
  end

  def restart(size) do
    GenServer.call(__MODULE__, {:restart, size})
  end

  def handle_call({:restart, size}, _from, state) do
    Board.restart()
    Users.restart()

    Board.Generator.generate({100, 100}, size)
    |> Enum.reduce(0, fn {{x, y}, true}, acc ->
      Board.add({x, y}, :field, acc, false)
      acc + 1
    end)

    Logger.info "Map generated"

    {:reply, :ok, state}
  end

  def handle_info(:destroy_field, state) do
    Process.send_after(self(), :destroy_field, @interval)

    {x, y} = Board.Generator.find_edge_point()

    Board.get_field({x, y})

    |> Enum.each(fn {field, _} ->
      case field do
        {:field, id}  ->
          :ok = Board.delete(:field, id)
          FearWeb.Endpoint.broadcast("game:lobby", "destroy_field", %{x: x, y: y})
        {:user, username} ->
          Game.kill_user(username)
          FearWeb.Endpoint.broadcast("game:lobby", "lose", %{x: x, y: y, name: username, move_time: 1000})
      end
    end)

    {:noreply, state}
  end

  def handle_info(:start, state) do
    Board.Generator.generate({100, 100}, size())
    |> Enum.reduce(0, fn {{x, y}, true}, acc ->
      Board.add({x, y}, :field, acc, false)
      acc + 1
    end)

    Logger.info "Map generated"

    {:noreply, state}
  end

end

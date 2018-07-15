defmodule Fear.Game.Watcher do
  use GenServer
  alias Fear.{Board, Game, Users}

  @interval 3000
  @size 2000

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

    Board.Generator.generate({50, 50}, size)
    |> Enum.reduce(0, fn {{x, y}, true}, acc ->
      Board.add({x, y}, :field, acc, false)
      acc + 1
    end)

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
    Board.Generator.generate({50, 50}, @size)
    |> Enum.reduce(0, fn {{x, y}, true}, acc ->
      Board.add({x, y}, :field, acc, false)
      acc + 1
    end)

    {:noreply, state}
  end

end

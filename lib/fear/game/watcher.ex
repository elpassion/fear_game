defmodule Fear.Game.Watcher do
  use GenServer
  alias Fear.{Board, Game, Users}

  @interval 300
  @size 400

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

    start = {50, 50}

    gen_map(%{start => true}, start, size, 1)
    |> Enum.reduce(0, fn {{x, y}, true}, acc ->
      Board.add({x, y}, :field, acc, false)
      acc + 1
    end)

    {:reply, :ok, state}
  end

  def handle_info(:destroy_field, state) do
    Process.send_after(self(), :destroy_field, @interval)

    {x, y} = find_edge_point()

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
    size = @size
    start = {50, 50}

    gen_map(%{start => true}, start, size, 1)
    |> Enum.reduce(0, fn {{x, y}, true}, acc ->
      Board.add({x, y}, :field, acc, false)
      acc + 1
    end)

    {:noreply, state}
  end

  defp find_edge_point() do
    points = Board.get_positions(:field)
    length = length(points)

    points_map =
      points
      |> Enum.map(& {&1, 0})
      |> Enum.into(%{})

    points
    |> Enum.map(&edge_count(points_map, &1))
    |> Enum.sort(fn {_point1, count1}, {_point2, count2} -> count1 >= count2 end)
    |> Enum.take(:math.sqrt(length) |> :math.ceil |> round)
    |> Enum.random()
    |> to_point()
  end

  defp to_point({{x, y}, _}), do: {x, y}

  defp edge_count(map, {x, y}) do
    count = 0
    count = if map[{x-1, y}] == nil, do: count + 1, else: count
    count = if map[{x+1, y}] == nil, do: count + 1, else: count
    count = if map[{x, y-1}] == nil, do: count + 1, else: count
    count = if map[{x, y+1}] == nil, do: count + 1, else: count
    count = if map[{x-1, y-1}] == nil, do: count + 1, else: count
    count = if map[{x+1, y+1}] == nil, do: count + 1, else: count
    count = if map[{x+1, y-1}] == nil, do: count + 1, else: count
    count = if map[{x-1, y+1}] == nil, do: count + 1, else: count
    {{x,y}, count}
  end

  defp gen_map(map, {x, y}, _size, _iteration) when x < 1 or y < 1, do: map
  defp gen_map(map, _, size, iteration) when iteration >= size, do: map
  defp gen_map(map, {x, y}, size, _iteration) do

    map = if :rand.uniform(2) == 1, do: Map.put(map, {x, y}, true), else: map
    if Map.get(map, {x, y}) do
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      gen_map(map, {x, y}, size, Map.keys(map) |> length)
    else
      map
    end
  end

  defp gen_dir(1, x, y), do: {x + 1, y}
  defp gen_dir(2, x, y), do: {x - 1, y}
  defp gen_dir(3, x, y), do: {x, y + 1}
  defp gen_dir(4, x, y), do: {x, y - 1}

end

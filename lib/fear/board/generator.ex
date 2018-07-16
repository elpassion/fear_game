defmodule Fear.Board.Generator do
  alias Fear.Board

  def generate({_x, _y} = start, size) do
    gen_map(%{start => true}, start, size, 1)
  end

  defp gen_map(map, {x, y}, _size, _iteration) when x < 1 or y < 1, do: map
  defp gen_map(map, _, size, iteration) when iteration >= size, do: map
  defp gen_map(map, {x, y}, size, _iteration) do
    map = if :rand.uniform(2) == 1, do: Map.put(map, {x, y}, true), else: map
    if Map.get(map, {x, y}) do
      map = gen_map_close(map, {x, y}, 4, 1)
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      map = gen_map(map, gen_dir(:rand.uniform(4), x, y), size, Map.keys(map) |> length)
      gen_map(map, {x, y}, size, Map.keys(map) |> length)
    else
      map
    end
  end

  defp gen_map_close(map, {x, y}, _size, _iteration) when x < 1 or y < 1, do: map
  defp gen_map_close(map, _, size, iteration) when iteration >= size, do: map
  defp gen_map_close(map, {x, y}, size, iteration) do
    map = if :rand.uniform(2) == 1, do: Map.put(map, {x, y}, true), else: map
    # gen_map_close(map, gen_dir(:rand.uniform(4), x, y), size, iteration + 1)
    map = gen_map_close(map, gen_dir(1, x, y), size, iteration + 1)
    map = gen_map_close(map, gen_dir(2, x, y), size, iteration + 1)
    map = gen_map_close(map, gen_dir(3, x, y), size, iteration + 1)
    map = gen_map_close(map, gen_dir(4, x, y), size, iteration + 1)
  end

  defp gen_dir(1, x, y), do: {x + 1, y}
  defp gen_dir(2, x, y), do: {x - 1, y}
  defp gen_dir(3, x, y), do: {x, y + 1}
  defp gen_dir(4, x, y), do: {x, y - 1}

  def find_edge_point() do
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

end

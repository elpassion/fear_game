defmodule Fear.User do
  defstruct [:name, :x, :y, :last_move, deaths: 0, speed: 220, alive?: true, flying?: false]

  def new(name, {x, y}) do
    %__MODULE__{name: name, x: x, y: y}
  end

  def update(user, opts \\ []) do
    Enum.reduce(opts, user, fn {key, val}, acc -> Map.put(acc, key, val) end)
  end

end

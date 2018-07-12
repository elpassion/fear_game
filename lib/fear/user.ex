defmodule Fear.User do
  defstruct [:name, :x, :y, :last_move, speed: 1, alive?: true]

  def new(name) do
    %__MODULE__{name: name, x: :rand.uniform(10), y: :rand.uniform(10)}
  end

  def update(user, opts \\ []) do
    Enum.reduce(opts, user, fn {key, val}, acc -> Map.put(acc, key, val) end)
  end

end

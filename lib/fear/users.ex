defmodule Fear.Users do
  use GenServer
  alias Fear.User

  def start_link(_) do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    {:ok, %{}}
  end

  def join(username) do
    GenServer.call(__MODULE__, {:join, username})
  end

  def update(username, opts \\ []) do
    GenServer.call(__MODULE__, {:update, username, opts})
  end

  def get(username) do
    GenServer.call(__MODULE__, {:get, username})
  end

  def all() do
    GenServer.call(__MODULE__, {:all})
  end

  def handle_call({:join, username}, _from, state) do
    user = get_user(state, username)
    {:reply, user, Map.put(state, username, user)}
  end

  def handle_call({:update, username, opts}, _from, state) do
    user =
      state
      |> get_user(username)
      |> User.update(opts)
    {:reply, user, Map.put(state, username, user)}
  end

  def handle_call({:get, username}, _from, state) do
    {:reply, Map.get(state, username), state}
  end

  def handle_call({:all}, _from, state) do
    users =
      state
      |> Enum.map(fn {_, v} -> v end)
      |> Enum.filter(& &1.alive?)
    {:reply, users, state}
  end

  defp get_user(state, username) do
    case Map.get(state, username) do
      nil -> User.new(username)
      user -> user
    end
  end


end

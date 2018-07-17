defmodule Fear.Users do
  use GenServer
  alias Fear.User

  def start_link() do
    GenServer.start_link(__MODULE__, :ok, name: __MODULE__)
  end

  def init(:ok) do
    {:ok, %{}}
  end

  def join(username, position) do
    GenServer.call(__MODULE__, {:join, username, position})
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

  def restart() do
    GenServer.call(__MODULE__, {:restart})
  end

  def count() do
    GenServer.call(__MODULE__, {:count})
  end

  def refresh() do
    GenServer.call(__MODULE__, {:refresh})
  end

  def leaderboard() do
    GenServer.call(__MODULE__, {:leaderboard})
  end

  def handle_call({:join, username, position}, _from, state) do
    user =
      state
      |> get_user(username, position)
      |> Map.put(:alive?, true)
      |> Map.put(:joined, true)
    {:reply, user, Map.put(state, username, user)}
  end

  def handle_call({:update, username, opts}, _from, state) do
    user =
      state
      |> Map.get(username)
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

  def handle_call({:restart}, _from, _state) do
    {:reply, :ok, %{}}
  end

  def handle_call({:count}, _from, state) do
    {:reply, Enum.count(state), state}
  end

  def handle_call({:refresh}, _from, state) do
    state =
      state
      |> Enum.map(fn {name, user} ->
        {name, %{user | deaths: 0, joined: false}}
      end)
      |> Enum.into(%{})
    {:reply, :ok, state}
  end

  def handle_call({:leaderboard}, _from, state) do
    leaderboard =
      state
      |> Enum.filter(fn {_name, user} -> user.joined end)
      |> Enum.map(fn {name, user} ->
        {name, user.deaths}
      end)
      |> Enum.into(%{})
    {:reply, leaderboard, state}
  end

  defp get_user(state, username, position) do
    case Map.get(state, username) do
      nil -> User.new(username, position)
      user -> user
    end
  end


end

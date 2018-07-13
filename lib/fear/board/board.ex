defmodule Fear.Board do
  @moduledoc """
  In state - board holds info about objects on board
  [
    {:user, username},
    {:monster, pid},
    {:object, object_id}
  ]
  """
  use GenServer
  alias Fear.Board.{Container, Directions, Moves}

  # CLIENT

  def start_link() do
    GenServer.start_link(__MODULE__, Container.new, name: __MODULE__)
  end

  def init(state) do
    {:ok, state}
  end

  def get_position(type, object) do
    GenServer.call(__MODULE__, {:get_position, type, object})
  end

  def add(position, type, object, blocks) do
    GenServer.call(__MODULE__, {:add, position, type, object, blocks})
  end

  def add_user(position, username) do
    GenServer.call(__MODULE__, {:add_user, position, username})
  end

  def delete(type, object) do
    GenServer.call(__MODULE__, {:delete, type, object})
  end

  def move(type, object, direction) do
    GenServer.call(__MODULE__, {:move, type, object, direction})
  end

  def get_field(position) do
    GenServer.call(__MODULE__, {:get_field, position})
  end

  def get_fields(position, range) do
    GenServer.call(__MODULE__, {:get_fields, position, range})
  end

  def get_positions(type) do
    GenServer.call(__MODULE__, {:get_positions, type})
  end

  # SERVER

  def handle_call({:get_position, type, object}, _from, %Container{} = container) do
    {:reply, Container.get_position(container, type, object), container}
  end

  def handle_call({:add_user, position, username}, _from, %Container{} = container) do
    position =
      case Container.get_free_spot(container, position, :user, username) do
        nil -> {1, 1}
        position -> position
      end
    container = Container.put(container, position, :user, username, true)
    {:reply, {:ok, position}, container}
  end

  def handle_call({:add, position, type, object, blocks}, _from, %Container{} = container) do
    container = Container.put(container, position, type, object, blocks)
    {:reply, {:ok, position}, container}
  end

  def handle_call({:delete, type, object}, _from, %Container{} = container) do
    container = Container.delete(container, type, object)
    {:reply, :ok, container}
  end

  def handle_call({:move, type, object, direction}, _from, %Container{} = container) do
    position = Container.get_position(container, type, object)
    new_position = Moves.add(position, Directions.calc(direction))

    cond do
      Container.blocks?(container, new_position) ->
        {:reply, {:error, position}, container}
      true ->
        container = Container.move(container, new_position, type, object)
        {:reply, {:ok, new_position}, container}
    end
  end

  def handle_call({:get_field, position}, _from, %Container{} = container) do
    field = Container.get_field(container, position)
    {:reply, field, container}
  end

  def handle_call({:get_fields, {x, y}, range}, _from, %Container{} = container) do
    fields =
      Enum.reduce(-range..range, %{}, fn i, a ->
        Enum.reduce(-range..range, a, fn j, acc ->
          field = Container.get_field(container, {x + i, y + j})
          Map.put(acc, {x + i, y + j}, field)
        end)
      end)
    {:reply, fields, container}
  end

  def handle_call({:get_positions, type}, _from, %Container{} = container) do
    {:reply, Container.get_positions(container, type), container}
  end

end

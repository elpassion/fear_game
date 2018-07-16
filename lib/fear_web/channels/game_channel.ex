defmodule FearWeb.GameChannel do
  use FearWeb, :channel
  alias Fear.{Game, Users}

  def join("game:lobby", _payload, socket) do
    if authorized?(socket) do
      case Game.join(socket.assigns[:username]) do
        {:ok, user} -> send(self(), {:joined, user})
        {:error, _} -> :ok
      end

      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("join", _, socket) do
    case Game.join(socket.assigns[:username]) do
      {:ok, user} -> send(self(), {:joined, user})
      {:error, _} -> :ok
    end

    {:noreply, socket}
  end

  def handle_in("get_map", _, socket) do
    push socket, "map", %{data: Game.get_map}
    {:noreply, socket}
  end

  def handle_in("move", %{"dir" => direction}, socket) do
    direction = String.to_existing_atom(direction)
    case Game.move(socket.assigns[:username], direction) do
      {:dead, user} ->
        push socket, "dead", %{x: user.x, y: user.y, name: user.name}
        {:noreply, socket}
      {:lose, user, move_time} ->
        broadcast socket, "move", %{x: user.x, y: user.y, name: user.name, move_time: move_time}
        broadcast socket, "lose", %{x: user.x, y: user.y, name: user.name, move_time: move_time}
        {:noreply, socket}
      {:ok, {x, y}, move_time} ->
        broadcast socket, "move", %{x: x, y: y, name: socket.assigns[:username], move_time: move_time}
        {:noreply, socket}
      {:error, {x, y}} ->
        broadcast socket, "move", %{x: x, y: y, name: socket.assigns[:username]}
        push socket, "blocked", %{x: x, y: y}
        {:noreply, socket}
    end
  end

  def handle_in("turn", %{"dir" => direction}, socket) do
    broadcast socket, "turn", %{name: socket.assigns[:username], dir: direction}
    {:noreply, socket}
  end

  def handle_in("hit", %{"dir" => direction, "username" => username}, socket) do
    direction = String.to_existing_atom(direction)
    case Game.fly(username, direction) do
      {:lose, user, move_time} ->
        broadcast socket, "fly_lose", %{x: user.x, y: user.y, name: user.name, move_time: move_time}
        {:noreply, socket}
      {:ok, user, move_time} ->
        broadcast socket, "fly", %{x: user.x, y: user.y, name: user.name, move_time: move_time}
        {:noreply, socket}
      _ ->
        {:noreply, socket}
    end
  end

  def handle_in("fire", %{"dir" => direction, "x" => x, "y" => y}, socket) do
    broadcast socket, "fire", %{x: x, y: y, dir: direction, username: socket.assigns[:username]}
    {:noreply, socket}
  end

  def handle_info({:joined, user}, socket) do
    push socket, "map", %{data: Game.get_map}
    push socket, "self_joined", Map.from_struct(user)
    broadcast socket, "user_joined", Map.from_struct(user)

    Enum.each(Users.all(), fn u ->
      if user.name != u.name, do: push socket, "user_joined", Map.from_struct(u)
    end)

    {:noreply, socket}
  end

  intercept ["user_joined", "turn"]

  def handle_out("user_joined", msg, socket) do
    if socket.assigns[:username] == msg.name do
      {:noreply, socket}
    else
      push socket, "user_joined", msg
      {:noreply, socket}
    end
  end

  def handle_out("turn", msg, socket) do
    if socket.assigns[:username] == msg.name do
      {:noreply, socket}
    else
      push socket, "turn", msg
      {:noreply, socket}
    end
  end

  defp authorized?(socket) do
    !!socket.assigns[:username]
  end

end

defmodule FearWeb.GameChannel do
  use FearWeb, :channel
  alias Fear.{Game, Users}

  def join("game:lobby", _payload, socket) do
    if authorized?(socket) do
      user = Game.join(socket.assigns[:username])
      Process.send_after(self(), {:joined, user}, 0)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("get_map", _, socket) do
    {:reply, {:ok, %{data: Game.get_map}}, socket}
  end

  def handle_in("move", %{"dir" => direction}, socket) do
    direction = String.to_existing_atom(direction)
    case Game.move(socket.assigns[:username], direction) do
      {:ok, {x, y}, move_time} ->
        broadcast socket, "move", %{x: x, y: y, name: socket.assigns[:username], move_time: move_time}
        {:noreply, socket}
      {:error, {x, y}} ->
        broadcast socket, "move", %{x: x, y: y, name: socket.assigns[:username]}
        push socket, "blocked", %{x: x, y: y}
        {:noreply, socket}
    end
  end

  def handle_info({:joined, user}, socket) do
    push socket, "self_joined", Map.from_struct(user)
    broadcast socket, "user_joined", Map.from_struct(user)

    Enum.each(Users.all(), fn u ->
      if user.name != u.name, do: push socket, "user_joined", Map.from_struct(u)
    end)

    {:noreply, socket}
  end

  intercept ["user_joined"]

  def handle_out("user_joined", msg, socket) do
    if socket.assigns[:username] == msg.name do
      {:noreply, socket}
    else
      push socket, "user_joined", msg
      {:noreply, socket}
    end
  end

  defp authorized?(socket) do
    !!socket.assigns[:username]
  end

end

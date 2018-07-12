defmodule FearWeb.GameChannel do
  use FearWeb, :channel
  alias Fear.Presence
  alias Fear.Game

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

  def handle_info({:joined, user}, socket) do

    push socket, "presence_state", Presence.list(socket)

    {:ok, _} = Presence.track(socket, user.name, %{
      online_at: inspect(System.system_time(:seconds)),
      name: user.name,
      x: user.x,
      y: user.y,
      speed: user.speed
    })

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

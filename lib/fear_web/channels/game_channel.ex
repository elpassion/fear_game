defmodule FearWeb.GameChannel do
  use FearWeb, :channel
  alias Fear.Presence

  @map %{
    data: [
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  1,  2,  3,  0,  0,  0,  1,  2,  3,  0 ],
      [  0,  5,  6,  7,  0,  0,  0,  5,  6,  7,  0 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  0,  0, 14, 13, 14,  0,  0,  0,  0,  0 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0 ],
      [  0,  0, 14, 14, 14, 14, 14,  0,  0,  0, 15 ],
      [  0,  0,  0,  0,  0,  0,  0,  0,  0, 15, 15 ],
      [ 35, 36, 37,  0,  0,  0,  0,  0, 15, 15, 15 ],
      [ 39, 39, 39, 39, 39, 39, 39, 39, 39, 39, 39 ]
    ]
  }

  def join("game:lobby", _payload, socket) do
    if authorized?(socket) do
      # user = Game.join(socket.assigns[:user_id])
      Process.send_after(self(), :joined, 0)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("get_map", _, socket) do
    {:reply, {:ok, @map}, socket}
  end

  def handle_info(:joined, socket) do
    username = socket.assigns[:username]

    push socket, "presence_state", Presence.list(socket)
    {:ok, _} = Presence.track(socket, username, %{
      online_at: inspect(System.system_time(:seconds)),
      name: username,
      x: 1,
      y: 1
    })

    push socket, "self_joined", %{name: username}
    broadcast socket, "user_joined", %{name: username}

    push socket, "map", @map

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

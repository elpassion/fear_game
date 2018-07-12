defmodule FearWeb.GameChannel do
  use FearWeb, :channel

  def join("game:lobby", _payload, socket) do
    if authorized?(socket) do
      # user = Game.join(socket.assigns[:user_id])
      Process.send_after(self(), :joined, 0)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_info(:joined, socket) do
    username = socket.assigns[:username]
    push socket, "self_joined", %{name: username}
    broadcast socket, "user_joined", %{name: username}

    push socket, "map", [
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

    {:noreply, socket}
  end


  defp authorized?(socket) do
    !!socket.assigns[:username]
  end

end

defmodule FearWeb.PageController do
  use FearWeb, :controller

  def index(conn, _params) do
    redirect conn, to: "/index.html"
  end

  def restart(conn, %{"size" => size}) do
    {size, _} = Integer.parse(size)

    Fear.Game.Watcher.restart(size)

    json conn, %{result: :success}
  end
end

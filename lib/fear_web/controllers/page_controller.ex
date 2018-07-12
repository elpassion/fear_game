defmodule FearWeb.PageController do
  use FearWeb, :controller

  def index(conn, _params) do
    render conn, "index.html"
  end
end

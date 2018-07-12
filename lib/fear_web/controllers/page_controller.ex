defmodule FearWeb.PageController do
  use FearWeb, :controller

  def index(conn, _params) do
    redirect conn, to: "/index.html"
  end
end

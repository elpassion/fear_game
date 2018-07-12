defmodule Fear.Game do
  alias Fear.{Board, Users}

  @starting_position {1, 1}

  def join(username) do
    user =
      username
      |> Users.join
      |> check_position

    {:ok, position} = Board.add_user({user.x, user.y}, username)
    update_user_position(user, position)
  end

  def get_fields({x, y}) do
    Board.get_fields({x, y}, 100)
    |> Enum.map(fn {position, field} -> {position, load_field(field)} end)
  end

  defp load_field(field) do
    field |> Enum.map(&load_object/1)
  end

  defp load_object({{:user, username}, _blocks}) do
    Users.get(username)
  end
  defp load_object(object), do: object

  def move(username, direction) do
    user = Users.get(username)
    move_time = round(100000 / (2 * (user.speed - 1) + 120))
    diff = NaiveDateTime.diff(NaiveDateTime.utc_now(), user.last_move, :millisecond)
    if diff >= move_time * 0.85 do # allow slightly faster movement for smooth movement on frontend
      case Board.move(:user, username, direction) do
        {:ok, position} ->
          update_user_position(user, position)
          {:ok, position, move_time}
        {:error, position} -> {:error, position}
      end
    else
      {:error, {user.x, user.y}}
    end
  end

  defp check_position(%{x: nil} = user) do
    update_user_position(user, @starting_position)
  end
  defp check_position(%{y: nil} = user) do
    update_user_position(user, @starting_position)
  end
  defp check_position(user), do: user

  defp update_user_position(user, {x, y}) do
    Users.update(user.name, x: x, y: y, last_move: NaiveDateTime.utc_now())
  end

end

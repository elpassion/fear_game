defmodule Fear.Game do
  alias Fear.{Board, Users}

  @max 200

  def join(username) do
    position = find_free_spot()
    user = Users.join(username, position)
    {:ok, position} = Board.add_user(position, username)
    update_user_position(user, position)
  end

  def get_map() do
    for i <- 0..@max do
      for j <- 0..@max do
        Board.get_field({j, i})
        |> fields_to_int
      end
    end
  end

  def move(username, direction) do
    user = Users.get(username)

    if user.alive? do
      move_time = round(100000 / (2 * (user.speed - 1) + 120))
      diff = NaiveDateTime.diff(NaiveDateTime.utc_now(), user.last_move, :millisecond)
      if diff >= move_time * 0.85 do # allow slightly faster movement for smooth movement on frontend
        case Board.move(:user, username, direction) do
          {:ok, position} ->
            if Board.get_field(position) |> Enum.count == 1 do
              user =
                update_user_position(user, position)
                |> kill_user()
              {:lose, user, move_time}
            else
              update_user_position(user, position)
              {:ok, position, move_time}
            end
          {:error, position} -> {:error, position}
        end
      else
        {:error, {user.x, user.y}}
      end
    else
      {:dead, user}
    end
  end

  defp find_free_spot() do
    Board.get_positions(:field)
    |> Enum.random
  end

  defp fields_to_int([]), do: -1
  defp fields_to_int(fields) do
    if Enum.any?(fields, fn {{type, _object}, _blocks} -> type == :field end), do: 1, else: -1
  end

  defp update_user_position(user, {x, y}) do
    Users.update(user.name, x: x, y: y, last_move: NaiveDateTime.utc_now())
  end

  defp kill_user(user) do
    Board.delete(:user, user.name)
    Users.update(user.name, alive?: false)
  end

end

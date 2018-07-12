defmodule Fear.Board.Container do
  alias Fear.Board.Container

  defstruct [fields: %{}, details: %{}]

  def new(), do: %Container{}

  def blocks?(%Container{fields: fields}, pos) do
    Map.get(fields, pos, [])
    |> List.keymember?(true, 1)
  end

  # Check if position is blocked, but ignore {type, object} in this check
  def blocks?(%Container{fields: fields}, pos, type, object) do
    Map.get(fields, pos, [])
    |> List.keydelete({type, object}, 0)
    |> List.keymember?(true, 1)
  end

  def get_position(%Container{details: details}, type, object) do
    Map.get(details, {type, object})
  end

  def get_field(%Container{fields: fields}, pos) do
    Map.get(fields, pos, [])
  end

  def get_field(%Container{} = container, pos, type) do
    container
    |> get_field(pos)
    |> Enum.filter(fn {{t, _e}, _b} -> t == type end)
  end

  def put(%Container{} = container, pos, type, object, blocks) do
    %Container{fields: fields, details: details} = delete(container, type, object)
    list = Map.get(fields, pos, [])
    fields = Map.put(fields, pos, [{{type, object}, blocks} | list])
    details = Map.put(details, {type, object}, pos)
    %Container{fields: fields, details: details}
  end

  def move(%Container{fields: fields} = container, pos, type, object) do
    old_pos = get_position(container, type, object)
    {_, blocks} = Map.get(fields, old_pos, []) |> List.keyfind({type, object}, 0)
    container
    |> delete(type, object)
    |> put(pos, type, object, blocks)
  end

  def delete(%Container{fields: fields, details: details} = container, type, object) do
    pos = get_position(container, type, object)
    list = Map.get(fields, pos, []) |> List.keydelete({type, object}, 0)
    fields = if list == [], do: Map.delete(fields, pos), else: Map.put(fields, pos, list)
    details = Map.delete(details, {type, object})
    %Container{fields: fields, details: details}
  end

  def get_free_spot(container, {x, y}, type, object) do
    mods = [0, -1, 1]
    Enum.reduce_while(mods, nil, fn mod_x, _ ->
      Enum.reduce_while(mods, nil, fn mod_y, _ ->
        pos = {x + mod_x, y + mod_y}
        container
        |> blocks?(pos, type, object)
        |> continue?(pos)
      end)
      |> continue?()
    end)
  end

  defp continue?(blocks \\ nil, pos)
  defp continue?(nil, nil), do: {:cont, nil}
  defp continue?(nil, pos), do: {:halt, pos}
  defp continue?(false, pos), do: {:halt, pos}
  defp continue?(true, _pos), do: {:cont, nil}

end

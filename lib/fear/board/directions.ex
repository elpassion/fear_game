defmodule Fear.Board.Directions do

  def calc(:n), do:  { 0, -1}
  def calc(:s), do:  { 0,  1}
  def calc(:w), do:  {-1,  0}
  def calc(:e), do:  { 1,  0}
  def calc(:nw), do: {-1, -1}
  def calc(:ne), do: { 1, -1}
  def calc(:sw), do: {-1,  1}
  def calc(:se), do: { 1,  1}
  def calc(_), do: raise "Wrong direction"

end

defmodule Fear.Presence do
  use Phoenix.Presence, otp_app: :fear,
                        pubsub_server: Fear.PubSub
end

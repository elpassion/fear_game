use Mix.Config

# In this file, we keep production configuration that
# you'll likely want to automate and keep away from
# your version control system.
#
# You should document the content of this
# file or create a script for recreating it, since it's
# kept out of version control and might be hard to recover
# or recreate for your teammates (or yourself later on).
config :fear, FearWeb.Endpoint,
  secret_key_base: "WpPNGIKNnPqxBCl/b1H+Mzu8fOsV2+klFQ57aDb5BvWLlycnDWSy5SW1wSc0BYHs"

# Configure your database
config :fear, Fear.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "fear_prod",
  pool_size: 15

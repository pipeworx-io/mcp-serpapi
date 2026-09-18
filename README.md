# mcp-serpapi

SerpApi MCP — wraps SerpApi (serpapi.com) search engines

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `serpapi_google_scholar` | Search Google Scholar for academic papers on `<topic>` — returns title, link, snippet, publication info, and citation count via SerpApi. Example: serpapi_google_scholar({ q: "graph neural networks", as_ylo: 2020, num: 10, _apiKey: "your-serpapi-key" }) |
| `serpapi_google_maps` | Find local businesses on Google Maps for `<query>` — returns name, address, rating, reviews, phone, website, and GPS coordinates via SerpApi. Example: serpapi_google_maps({ q: "coffee shops", ll: "@40.7,-74.0,14z", _apiKey: "your-serpapi-key" }) |
| `serpapi_google_trends` | Get Google Trends interest-over-time for `<terms>` — returns the requested trends block (interest over time, by region, or related queries) via SerpApi. Example: serpapi_google_trends({ q: "bitcoin,ethereum", date: "today 12-m", geo: "US", _apiKey: "your-serpapi-key" }) |
| `serpapi_google_jobs` | Search Google Jobs for `<query>` — returns title, company, location, source, posted date, schedule, description, and apply link via SerpApi. Example: serpapi_google_jobs({ q: "data engineer", location: "Austin, TX", _apiKey: "your-serpapi-key" }) |
| `serpapi_google_news` | Search Google News for `<query>` — returns headline, source, link, date, and snippet via SerpApi. Example: serpapi_google_news({ q: "openai", gl: "us", hl: "en", _apiKey: "your-serpapi-key" }) |
| `serpapi_google_shopping` | Search Google Shopping for `<query>` — returns product title, price, source, rating, reviews, product ID, and link via SerpApi. Example: serpapi_google_shopping({ q: "wireless earbuds", gl: "us", hl: "en", _apiKey: "your-serpapi-key" }) |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "serpapi": {
      "url": "https://gateway.pipeworx.io/serpapi/mcp"
    }
  }
}
```

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/serpapi/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Serpapi data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

This pack takes your own API key (`_apiKey`) — we don't front one for it, so there's no curl here that would run without it. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/serpapi_google_scholar`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.

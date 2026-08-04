# mcp-serpapi

SerpApi MCP — wraps SerpApi (serpapi.com) search engines

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Serpapi data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

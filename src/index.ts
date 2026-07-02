interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * SerpApi MCP — wraps SerpApi (serpapi.com) search engines
 *
 * Tools (Google verticals our `serper` Google-organic pack does NOT cover):
 * - serpapi_google_scholar: academic papers from Google Scholar
 * - serpapi_google_maps: local businesses / places from Google Maps
 * - serpapi_google_trends: search-interest trends over time
 * - serpapi_google_jobs: job listings from Google Jobs
 * - serpapi_google_news: news articles from Google News
 * - serpapi_google_shopping: product listings from Google Shopping
 *
 * Auth: BYO key only. Pass _apiKey = your SerpApi key (passed as `api_key`
 * query param). Each tool selects its vertical via the `engine` param.
 */


const BASE_URL = 'https://serpapi.com/search';

const tools: McpToolExport['tools'] = [
  {
    name: 'serpapi_google_scholar',
    description:
      'Search Google Scholar for academic papers on `<topic>` — returns title, link, snippet, publication info, and citation count via SerpApi. Example: serpapi_google_scholar({ q: "graph neural networks", as_ylo: 2020, num: 10, _apiKey: "your-serpapi-key" })',
    inputSchema: {
      type: 'object' as const,
      properties: {
        q: {
          type: 'string',
          description: 'Search query / topic, e.g. "graph neural networks"',
        },
        as_ylo: {
          type: 'integer',
          description: 'Optional start year (results published from this year onward), e.g. 2020',
        },
        as_yhi: {
          type: 'integer',
          description: 'Optional end year (results published up to this year), e.g. 2024',
        },
        num: {
          type: 'integer',
          description: 'Max results to return (default 10, max 20)',
        },
        _apiKey: {
          type: 'string',
          description: 'SerpApi API key (get one at serpapi.com)',
        },
      },
      required: ['q', '_apiKey'],
    },
  },
  {
    name: 'serpapi_google_maps',
    description:
      'Find local businesses on Google Maps for `<query>` — returns name, address, rating, reviews, phone, website, and GPS coordinates via SerpApi. Example: serpapi_google_maps({ q: "coffee shops", ll: "@40.7,-74.0,14z", _apiKey: "your-serpapi-key" })',
    inputSchema: {
      type: 'object' as const,
      properties: {
        q: {
          type: 'string',
          description: 'Search query, e.g. "coffee shops", "plumbers near me"',
        },
        ll: {
          type: 'string',
          description: 'Optional GPS location + zoom anchor, e.g. "@40.7,-74.0,14z" (latitude,longitude,zoom)',
        },
        _apiKey: {
          type: 'string',
          description: 'SerpApi API key (get one at serpapi.com)',
        },
      },
      required: ['q', '_apiKey'],
    },
  },
  {
    name: 'serpapi_google_trends',
    description:
      'Get Google Trends interest-over-time for `<terms>` — returns the requested trends block (interest over time, by region, or related queries) via SerpApi. Example: serpapi_google_trends({ q: "bitcoin,ethereum", date: "today 12-m", geo: "US", _apiKey: "your-serpapi-key" })',
    inputSchema: {
      type: 'object' as const,
      properties: {
        q: {
          type: 'string',
          description: 'Up to 5 comma-separated terms to compare, e.g. "bitcoin,ethereum"',
        },
        data_type: {
          type: 'string',
          description:
            'Trends block to return (default "TIMESERIES"). One of TIMESERIES, GEO_MAP, GEO_MAP_0, RELATED_QUERIES',
        },
        date: {
          type: 'string',
          description: 'Optional time range, e.g. "today 12-m", "today 5-y", "2021-01-01 2021-12-31"',
        },
        geo: {
          type: 'string',
          description: 'Optional two-letter geo code to scope the trend, e.g. "US", "GB"',
        },
        _apiKey: {
          type: 'string',
          description: 'SerpApi API key (get one at serpapi.com)',
        },
      },
      required: ['q', '_apiKey'],
    },
  },
  {
    name: 'serpapi_google_jobs',
    description:
      'Search Google Jobs for `<query>` — returns title, company, location, source, posted date, schedule, description, and apply link via SerpApi. Example: serpapi_google_jobs({ q: "data engineer", location: "Austin, TX", _apiKey: "your-serpapi-key" })',
    inputSchema: {
      type: 'object' as const,
      properties: {
        q: {
          type: 'string',
          description: 'Job search query, e.g. "data engineer", "barista part time"',
        },
        location: {
          type: 'string',
          description: 'Optional location, e.g. "Austin, TX", "London, United Kingdom"',
        },
        _apiKey: {
          type: 'string',
          description: 'SerpApi API key (get one at serpapi.com)',
        },
      },
      required: ['q', '_apiKey'],
    },
  },
  {
    name: 'serpapi_google_news',
    description:
      'Search Google News for `<query>` — returns headline, source, link, date, and snippet via SerpApi. Example: serpapi_google_news({ q: "openai", gl: "us", hl: "en", _apiKey: "your-serpapi-key" })',
    inputSchema: {
      type: 'object' as const,
      properties: {
        q: {
          type: 'string',
          description: 'News search query, e.g. "openai", "federal reserve rate"',
        },
        gl: {
          type: 'string',
          description: 'Optional two-letter country code, e.g. "us", "gb"',
        },
        hl: {
          type: 'string',
          description: 'Optional two-letter UI language code, e.g. "en", "fr"',
        },
        _apiKey: {
          type: 'string',
          description: 'SerpApi API key (get one at serpapi.com)',
        },
      },
      required: ['q', '_apiKey'],
    },
  },
  {
    name: 'serpapi_google_shopping',
    description:
      'Search Google Shopping for `<query>` — returns product title, price, source, rating, reviews, product ID, and link via SerpApi. Example: serpapi_google_shopping({ q: "wireless earbuds", gl: "us", hl: "en", _apiKey: "your-serpapi-key" })',
    inputSchema: {
      type: 'object' as const,
      properties: {
        q: {
          type: 'string',
          description: 'Product search query, e.g. "wireless earbuds", "running shoes"',
        },
        gl: {
          type: 'string',
          description: 'Optional two-letter country code, e.g. "us", "gb"',
        },
        hl: {
          type: 'string',
          description: 'Optional two-letter UI language code, e.g. "en", "fr"',
        },
        _apiKey: {
          type: 'string',
          description: 'SerpApi API key (get one at serpapi.com)',
        },
      },
      required: ['q', '_apiKey'],
    },
  },
];

interface SerpResponse {
  error?: string;
  [key: string]: unknown;
}

async function serpGet(
  params: Record<string, string>,
  apiKey: string,
  tool: string,
): Promise<SerpResponse> {
  if (!apiKey) {
    throw new Error(
      `${tool} requires a SerpApi key. Pass _apiKey = your SerpApi API key (sign up and get one at serpapi.com). This is a bring-your-own-key data source — your key bears the SerpApi search cost.`,
    );
  }
  const search = new URLSearchParams({ api_key: apiKey, output: 'json', ...params });
  const res = await fetch(`${BASE_URL}?${search}`);
  if (!res.ok) {
    // SerpApi returns a JSON body with an `error` field even on 4xx; surface it if present.
    let detail = '';
    try {
      const body = (await res.json()) as SerpResponse;
      if (body && typeof body.error === 'string') detail = `: ${body.error}`;
    } catch {
      // non-JSON error body — fall back to the status line
    }
    if (detail) throw new Error(`SerpApi ${tool}${detail}`);
    throw new Error(`SerpApi ${tool} error: HTTP ${res.status}`);
  }
  const data = (await res.json()) as SerpResponse;
  // SerpApi can return 200 with an `error` field on bad/empty requests.
  if (typeof data.error === 'string' && data.error) {
    throw new Error(`SerpApi ${tool}: ${data.error}`);
  }
  return data;
}

function asObj(v: unknown): Record<string, unknown> {
  return (v ?? {}) as Record<string, unknown>;
}

function asArr(v: unknown): Array<Record<string, unknown>> {
  return Array.isArray(v) ? (v as Array<Record<string, unknown>>) : [];
}

async function googleScholar(args: Record<string, unknown>, apiKey: string) {
  const q = args.q as string;
  if (!q) throw new Error('serpapi_google_scholar requires a `q` search query (e.g. "graph neural networks").');
  const num = Math.min(Math.max(Number(args.num ?? 10), 1), 20);
  const params: Record<string, string> = { engine: 'google_scholar', q, num: String(num) };
  if (args.as_ylo != null) params.as_ylo = String(args.as_ylo);
  if (args.as_yhi != null) params.as_yhi = String(args.as_yhi);

  const data = await serpGet(params, apiKey, 'serpapi_google_scholar');
  const results = asArr(data.organic_results).map((r) => {
    const pubInfo = asObj(r.publication_info);
    const inlineLinks = asObj(r.inline_links);
    const citedBy = asObj(inlineLinks.cited_by);
    return {
      title: (r.title as string) ?? null,
      link: (r.link as string) ?? null,
      snippet: (r.snippet as string) ?? null,
      publication: (pubInfo.summary as string) ?? null,
      cited_by: (citedBy.total as number) ?? null,
    };
  });
  return { q, count: results.length, results };
}

async function googleMaps(args: Record<string, unknown>, apiKey: string) {
  const q = args.q as string;
  if (!q) throw new Error('serpapi_google_maps requires a `q` search query (e.g. "coffee shops").');
  const params: Record<string, string> = { engine: 'google_maps', q, type: 'search' };
  if (args.ll) params.ll = args.ll as string;

  const data = await serpGet(params, apiKey, 'serpapi_google_maps');
  const results = asArr(data.local_results).map((r) => ({
    title: (r.title as string) ?? null,
    address: (r.address as string) ?? null,
    rating: (r.rating as number) ?? null,
    reviews: (r.reviews as number) ?? null,
    type: (r.type as string) ?? null,
    phone: (r.phone as string) ?? null,
    website: (r.website as string) ?? null,
    gps: r.gps_coordinates ?? null,
    place_id: (r.place_id as string) ?? null,
  }));
  return { q, count: results.length, results };
}

async function googleTrends(args: Record<string, unknown>, apiKey: string) {
  const q = args.q as string;
  if (!q) throw new Error('serpapi_google_trends requires a `q` (up to 5 comma-separated terms, e.g. "bitcoin,ethereum").');
  const data_type = (args.data_type as string) ?? 'TIMESERIES';
  const geo = args.geo as string | undefined;
  const params: Record<string, string> = { engine: 'google_trends', q, data_type };
  if (args.date) params.date = args.date as string;
  if (geo) params.geo = geo;

  const data = await serpGet(params, apiKey, 'serpapi_google_trends');

  // Pick the block that matches the requested data_type, falling back across
  // the keys SerpApi may use for each Trends view.
  let block: unknown = null;
  switch (data_type) {
    case 'GEO_MAP':
    case 'GEO_MAP_0':
      block = data.compared_breakdown_by_region ?? data.interest_by_region ?? null;
      break;
    case 'RELATED_QUERIES':
      block = data.related_queries ?? null;
      break;
    case 'TIMESERIES':
    default:
      block = data.interest_over_time ?? null;
      break;
  }

  return { q, data_type, geo: geo ?? null, data: block };
}

async function googleJobs(args: Record<string, unknown>, apiKey: string) {
  const q = args.q as string;
  if (!q) throw new Error('serpapi_google_jobs requires a `q` search query (e.g. "data engineer").');
  const params: Record<string, string> = { engine: 'google_jobs', q };
  if (args.location) params.location = args.location as string;

  const data = await serpGet(params, apiKey, 'serpapi_google_jobs');
  const results = asArr(data.jobs_results).map((r) => {
    const ext = asObj(r.detected_extensions);
    const applyOptions = asArr(r.apply_options);
    const description = (r.description as string) ?? null;
    return {
      title: (r.title as string) ?? null,
      company: (r.company_name as string) ?? null,
      location: (r.location as string) ?? null,
      via: (r.via as string) ?? null,
      posted_at: (ext.posted_at as string) ?? null,
      schedule: (ext.schedule_type as string) ?? null,
      description: description && description.length > 500 ? `${description.slice(0, 500)}…` : description,
      apply_link: (asObj(applyOptions[0]).link as string) ?? null,
    };
  });
  return { q, count: results.length, results };
}

async function googleNews(args: Record<string, unknown>, apiKey: string) {
  const q = args.q as string;
  if (!q) throw new Error('serpapi_google_news requires a `q` search query (e.g. "openai").');
  const params: Record<string, string> = { engine: 'google_news', q };
  if (args.gl) params.gl = args.gl as string;
  if (args.hl) params.hl = args.hl as string;

  const data = await serpGet(params, apiKey, 'serpapi_google_news');
  const results = asArr(data.news_results).map((r) => ({
    title: (r.title as string) ?? null,
    source: (asObj(r.source).name as string) ?? null,
    link: (r.link as string) ?? null,
    date: (r.date as string) ?? null,
    snippet: (r.snippet as string) ?? null,
  }));
  return { q, count: results.length, results };
}

async function googleShopping(args: Record<string, unknown>, apiKey: string) {
  const q = args.q as string;
  if (!q) throw new Error('serpapi_google_shopping requires a `q` search query (e.g. "wireless earbuds").');
  const params: Record<string, string> = { engine: 'google_shopping', q };
  if (args.gl) params.gl = args.gl as string;
  if (args.hl) params.hl = args.hl as string;

  const data = await serpGet(params, apiKey, 'serpapi_google_shopping');
  const results = asArr(data.shopping_results).map((r) => ({
    title: (r.title as string) ?? null,
    price: (r.price as string) ?? null,
    source: (r.source as string) ?? null,
    rating: (r.rating as number) ?? null,
    reviews: (r.reviews as number) ?? null,
    product_id: (r.product_id as string) ?? null,
    link: (r.link as string) ?? null,
  }));
  return { q, count: results.length, results };
}

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const apiKey = args._apiKey as string;
  delete args._apiKey;

  switch (name) {
    case 'serpapi_google_scholar':
      return googleScholar(args, apiKey);
    case 'serpapi_google_maps':
      return googleMaps(args, apiKey);
    case 'serpapi_google_trends':
      return googleTrends(args, apiKey);
    case 'serpapi_google_jobs':
      return googleJobs(args, apiKey);
    case 'serpapi_google_news':
      return googleNews(args, apiKey);
    case 'serpapi_google_shopping':
      return googleShopping(args, apiKey);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// BYO-only: nominal access meter; the user's own SerpApi key bears the COGS.
export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;

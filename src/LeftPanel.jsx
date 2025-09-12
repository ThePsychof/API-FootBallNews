import React, { useState, useEffect } from "react";
import "./LeftPanel.css";
import demoNews from "./DemoNewsData.json";

function LeftPanel({ apiToken, newsApiUrl }) {
  const [news, setNews] = useState([]);
  const [newsLang, setNewsLang] = useState("");
  const [newsCount, setNewsCount] = useState(6);
  const [hasMoreNews, setHasMoreNews] = useState(false);

  const fetchNews = async () => {
    const useDemo = !apiToken || !newsApiUrl;
    let data;

    try {
      if (useDemo) {
        // Shuffle demo news to simulate live updates
        data = [...demoNews].sort(() => 0.5 - Math.random());
      } else {
        const langParam = `newsLang ? ?lang=${newsLang} : ""`;
        const res = `await fetch(${newsApiUrl}${langParam}, {
          headers: { Authorization: Bearer ${apiToken} },
        })`;
        if (!res.ok) throw new Error("Failed to fetch news");
        data = await res.json();
      }

      setHasMoreNews(data.length > newsCount);
      setNews(data.slice(0, newsCount));
    } catch (err) {
      console.error(err);
      if (useDemo) setNews([...demoNews].slice(0, newsCount));
      else setNews([]);
      setHasMoreNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [apiToken, newsApiUrl, newsLang, newsCount]);

  return (
    <div className="panel left-panel">
      <div className="panel-header">
        <div className="panel-title">Breaking News</div>
        
        <div className="panel-filters">
          <select
            value={newsLang}
            onChange={(e) => setNewsLang(e.target.value)}
            className="lang-filter"
            aria-label="Select news language"
          >
            <option value="">All</option>
            <option value="en">English</option>
          </select>
          <select
            value={newsCount}
            onChange={(e) => setNewsCount(Number(e.target.value))}
            className="lang-filter"
            aria-label="Select number of news"
          >
            {[3, 6, 10, 15].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel-content">
        {news.map((n) =>
          n.url ? (
            <a
              className="panel-row"
              key={n.id}
              href={n.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {n.title}
            </a>
          ) : (
            <div className="panel-row" key={n.id}>
              {n.title}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default LeftPanel;
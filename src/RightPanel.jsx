import React, { useEffect, useState } from "react";
import "./RightPanel.css";
import DemoVersion from "./DemoVersion.json";

// Constants
const MAX_MATCHES = 12;
const ROW_HEIGHT = 40; // px

function RightPanel({ API_TOKEN, API_HOST }) {
  // 🔥 Demo mode if no token or host
  const usedemo = !API_TOKEN || !API_HOST;

  const [matches, setMatches] = useState(usedemo ? DemoVersion.slice(0, MAX_MATCHES) : []);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("39"); // Default: Premier League
  const [loading, setLoading] = useState(!usedemo);
  const [error, setError] = useState(null);
  const [matchCount, setMatchCount] = useState(MAX_MATCHES);
  const [hasMore, setHasMore] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [detailPos, setDetailPos] = useState({ top: 0 });

  // Fetch leagues
  useEffect(() => {
    if (usedemo) return; // skip API if demo mode

    const fetchLeagues = async () => {
      try {
        const res = await fetch(`${API_HOST}/leagues`, {
          headers: { "x-apisports-key": API_TOKEN },
        });
        const data = await res.json();
        setLeagues(data.response || []);
      } catch (err) {
        console.error(err);
        setError("Error fetching leagues");
      }
    };

    fetchLeagues();
  }, [API_HOST, API_TOKEN, usedemo]);

  // Fetch matches
  const fetchMatches = async () => {
    if (usedemo) {
      setMatches(DemoVersion.slice(0, matchCount));
      setHasMore(DemoVersion.length > matchCount);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split("T")[0];
      const now = new Date();
      const season = now.getMonth() + 1 < 7 ? now.getFullYear() - 1 : now.getFullYear();

      const url = `${API_HOST}/fixtures?date=${today}&league=${selectedLeague}&season=${season}`;
      console.log("Fetching:", url);

      const res = await fetch(url, {
        headers: { "x-apisports-key": API_TOKEN },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`API request failed: ${res.status} ${text}`);
      }

      const data = await res.json();
      const allMatches = data.response || [];

      setMatches(allMatches.slice(0, matchCount));
      setHasMore(allMatches.length > matchCount);
    } catch (err) {
      console.error(err);
      setError("Error fetching matches");
      setMatches(DemoVersion.slice(0, matchCount)); // fallback demo
      setHasMore(DemoVersion.length > matchCount);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [selectedLeague, matchCount, API_HOST, API_TOKEN, usedemo]);

  const handleMatchClick = (match, idx) => {
    setSelectedMatch(match);
    setDetailPos({ top: idx * ROW_HEIGHT + 60 });
  };

  return (
    <div className="right-panel">
      {/* Filter bar */}
      <div className="filter-bar">
        <select
          value={selectedLeague}
          onChange={(e) => setSelectedLeague(e.target.value)}
          aria-label="Select league"
        >
          {leagues.map((l) => (
            <option key={l.league.id} value={l.league.id}>
              {l.league.name} ({l.country.name})
            </option>
          ))}
        </select>

        <select
          value={matchCount}
          onChange={(e) => setMatchCount(Number(e.target.value))}
          aria-label="Select number of matches"
        >
          {[6, 8, 10, 12, 20, 30].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Matches list */}
      <div className="matches-list">
        {loading ? (
          <p className="loading">⏳ Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : matches.length === 0 ? (
          <p className="empty">No matches yet 😢</p>
        ) : (
          <>
            {matches.map((m, idx) => (
              <div
                key={m.fixture.id}
                className={`match-row ${
                  selectedMatch && selectedMatch.fixture.id === m.fixture.id ? "selected" : ""
                }`}
                onClick={() => handleMatchClick(m, idx)}
              >
                {/* Home */}
                <div className="team">
                  <div className="tooltip-container">
                    <img
                      src={m.teams.home?.logo}
                      alt={m.teams.home?.name}
                      className="team-logo"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className="tooltip-text">{m.teams.home?.name ?? "?"}</span>
                  </div>
                </div>

                {/* Score */}
                <div className="score">
                  {m.goals?.home ?? "-"} : {m.goals?.away ?? "-"}
                </div>

                {/* Away */}
                <div className="team">
                  <div className="tooltip-container">
                    <img
                      src={m.teams.away?.logo}
                      alt={m.teams.away?.name}
                      className="team-logo"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                    <span className="tooltip-text">{m.teams.away?.name ?? "?"}</span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default RightPanel;
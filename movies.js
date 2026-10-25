export async function onRequest(context) {
  const token = context.env.TMDB_READ_TOKEN;
  if (!token) return Response.json({ error: "TMDB token is not configured" }, { status: 503 });
  const region = (context.env.TMDB_REGION || "US").toUpperCase();
  const lang = context.env.TMDB_LANGUAGE || "ru-RU";
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };
  try {
    const endpoints = [
      `https://api.themoviedb.org/3/movie/upcoming?language=${encodeURIComponent(lang)}&page=1&region=${encodeURIComponent(region)}`,
      `https://api.themoviedb.org/3/movie/now_playing?language=${encodeURIComponent(lang)}&page=1&region=${encodeURIComponent(region)}`
    ];
    const responses = await Promise.all(endpoints.map(async url => {
      const r = await fetch(url, { headers });
      if (!r.ok) throw new Error(`TMDB returned ${r.status}`);
      return r.json();
    }));
    const all = responses.flatMap(x => x.results || []);
    const unique = [...new Map(all.map(m => [m.id, m])).values()]
      .sort((a,b) => (a.release_date || "9999").localeCompare(b.release_date || "9999"))
      .map(m => ({
        id: m.id,
        title: m.title || m.original_title || "Без названия",
        originalTitle: m.original_title || "",
        overview: m.overview || "",
        date: m.release_date || "",
        poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "",
        rating: m.vote_average || 0,
        language: m.original_language || ""
      }));
    return Response.json({ results: unique, updated: new Date().toISOString(), region }, {
      headers: { "Cache-Control": "public, max-age=900, s-maxage=1800", "Access-Control-Allow-Origin": "*" }
    });
  } catch (err) {
    return Response.json({ error: "Не удалось загрузить базу фильмов", detail: String(err) }, { status: 502 });
  }
}
import cachedFetch from "utils/cached-fetch";
import { getSettings } from "utils/config";

export default async function handler(req, res) {
  const { latitude, longitude, provider, cache, lang } = req.query;
  let { apiKey } = req.query;

  if (!apiKey && !provider) {
    return res.status(400).json({ error: "Missing API key or provider" });
  }

  if (!apiKey && provider !== "weatherapi") {
    return res.status(400).json({ error: "Invalid provider for endpoint" });
  }

  if (!apiKey && provider) {
    const settings = await getSettings();
    apiKey = settings?.providers?.weatherapi;
  }

  if (!apiKey) {
    return res.status(400).json({ error: "Missing API key" });
  }

  const apiUrl = `http://api.weatherapi.com/v1/current.json?q=${latitude},${longitude}&key=${apiKey}&lang=${lang}`;

  return res.send(await cachedFetch(apiUrl, cache));
}

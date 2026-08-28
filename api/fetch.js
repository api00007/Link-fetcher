export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const url = body.url || req.query.url;
    const referer = body.referer || req.query.referer;
    const method = body.method || req.query.method || 'GET';

    if (!url) {
        return res.status(400).json({ statusCode: 400, data: 'Target URL is required' });
    }

    try {
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': '*/*'
        };

        if (referer && referer.trim() !== '') {
            headers['Referer'] = referer.trim();
        }

        const response = await fetch(url, {
            method: method.toUpperCase(),
            headers: headers,
            redirect: 'follow'
        });

        const rawData = await response.text();

        return res.status(200).json({
            statusCode: response.status,
            statusText: response.statusText,
            data: rawData
        });
    } catch (err) {
        return res.status(200).json({
            statusCode: 500,
            statusText: 'Internal Error',
            data: err.message
        });
    }
}

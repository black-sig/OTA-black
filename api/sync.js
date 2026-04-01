export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { targetUrl, appData } = req.body;
        
        if (!targetUrl || !appData) {
            return res.status(400).json({ error: 'Missing targetUrl or appData payload.' });
        }
        
        // سحب التوكن السري من إعدادات Vercel
        const SECRET_TOKEN = process.env.STORE_SECRET_TOKEN;

        const headers = {
            'Content-Type': 'application/json'
        };

        // إضافة التوكن كحماية إذا كان موجوداً في إعدادات Vercel
        if (SECRET_TOKEN) {
            headers['Authorization'] = `Bearer ${SECRET_TOKEN}`;
        }

        // إرسال البيانات من سيرفر Vercel إلى هدفك (API متجرك أو GitHub)
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(appData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Target server rejected the request: ${response.status} - ${errorText}`);
        }

        // محاولة قراءة الرد كـ JSON، وإن فشل نتجاهله
        const data = await response.json().catch(() => ({})); 
        
        res.status(200).json({ success: true, message: 'Data synced securely via proxy.', data });

    } catch (error) {
        console.error('Secure Sync Error:', error);
        res.status(500).json({ error: 'Failed to sync data securely.', details: error.message });
    }
}

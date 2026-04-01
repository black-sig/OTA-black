export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Cache-Control', 'no-store, max-age=0'); // إجبار أبل على عدم تخزين الرابط لتجنب أخطاء التثبيت

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { ipa_url, bundle_id, version, app_name } = req.query;

    if (!ipa_url) return res.status(400).send('FATAL: Payload URL missing.');

    const safeBundleId = bundle_id || 'com.void.blackstore';
    const safeVersion = version || '1.0.0';
    const safeAppName = app_name || 'هذا التطبيق';
    const safeIconUrl = 'https://up6.cc/2026/04/177500568816331.png';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>items</key>
    <array>
        <dict>
            <key>assets</key>
            <array>
                <dict>
                    <key>kind</key>
                    <string>software-package</string>
                    <key>url</key>
                    <string><![CDATA[${ipa_url}]]></string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>display-image</string>
                    <key>needs-shine</key>
                    <false/>
                    <key>url</key>
                    <string><![CDATA[${safeIconUrl}]]></string>
                </dict>
            </array>
            <key>metadata</key>
            <dict>
                <key>bundle-identifier</key>
                <string>${safeBundleId}</string>
                <key>bundle-version</key>
                <string>${safeVersion}</string>
                <key>kind</key>
                <string>software</string>
                <key>title</key>
                <string><![CDATA[${safeAppName}]]></string>
            </dict>
        </dict>
    </array>
</dict>
</plist>`;

    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.status(200).send(xml);
}

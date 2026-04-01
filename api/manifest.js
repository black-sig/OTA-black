export default function handler(req, res) {
    // تفعيل CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { ipa_url, bundle_id, version, app_name } = req.query;

    if (!ipa_url) {
        return res.status(400).send('Missing ipa_url parameter');
    }

    // تأمين القيم الافتراضية، مع جعل "هذا التطبيق" هو الاسم الذي يظهر في رسالة iOS
    const safeBundleId = bundle_id || 'com.otablack.app';
    const safeVersion = version || '1.0.0';
    const safeAppName = app_name || 'هذا التطبيق';
    
    // 🔥 تثبيت الصورة التي طلبتها لتظهر عند التثبيت 🔥
    const safeIconUrl = 'https://up6.cc/2026/04/177500568816331.png';

    // بناء قالب XML الخاص بـ Apple OTA
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
                    <key>url</key>
                    <string><![CDATA[${safeIconUrl}]]></string>
                </dict>
                <dict>
                    <key>kind</key>
                    <string>full-size-image</string>
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
                <string><![CDATA[${safeAppName}]]></string> </dict>
        </dict>
    </array>
</dict>
</plist>`;

    // إرسال المحتوى كملف XML صالح
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.status(200).send(xml);
}

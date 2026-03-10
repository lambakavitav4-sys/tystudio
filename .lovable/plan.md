

# Add Alternative Ad Networks to TY Studio

## What We'll Build
Expand the Admin Dashboard's AdSense tab into a full **Ad Management** tab that supports multiple ad networks beyond Google AdSense:

- **Google AdSense** (existing)
- **Media.net** (Yahoo/Bing network, good for contextual ads)
- **PropellerAds** (pop-under, push notifications, native ads — easier approval)
- **Custom HTML ads** (any ad code snippet)

## How It Works

### Database
- Add new rows in `site_settings` for each ad network key: `medianet_code`, `propellerads_code`, `custom_ad_code`, and an `active_ad_network` key to toggle which one is active.

### Admin Dashboard Changes (`Admin.tsx`)
- Rename "AdSense" tab to "Ads"
- Add a selector to choose the active ad network
- Show the appropriate code input field for each network
- Add helper text with signup links for each network

### AdSenseBanner Component → AdBanner
- Rename to `AdBanner.tsx`
- Fetch `active_ad_network` from `site_settings`
- Fetch the corresponding ad code and render it
- Support fallback: if active network has no code, show nothing

### Files Changed
1. **`src/components/AdSenseBanner.tsx`** → Rename/rewrite to `AdBanner.tsx`, fetch active network + code
2. **`src/pages/Admin.tsx`** → Replace AdSense tab with multi-network Ads tab
3. **`src/pages/Index.tsx`** & **`src/pages/Watch.tsx`** → Update import from `AdSenseBanner` to `AdBanner`

No database migration needed — we'll use the existing `site_settings` table with new key values.


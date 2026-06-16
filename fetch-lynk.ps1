[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Try with WebClient instead which sometimes bypasses 403
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
$wc.Headers.Add("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8")
$wc.Headers.Add("Accept-Language", "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7")
$wc.Headers.Add("Sec-Fetch-Dest", "document")
$wc.Headers.Add("Sec-Fetch-Mode", "navigate")
$wc.Headers.Add("Sec-Fetch-Site", "none")
$wc.Headers.Add("Sec-Fetch-User", "?1")
$wc.Headers.Add("Upgrade-Insecure-Requests", "1")

try {
    $content = $wc.DownloadString("https://lynk.id/berseni.id/kydxrrno2564")
    $content | Out-File -FilePath "lynk-page.html" -Encoding utf8
    Write-Host "Success! Saved HTML, length: $($content.Length)"
    
    # Extract title and description from meta tags
    if ($content -match '<title>(.*?)</title>') { Write-Host "Title: $($matches[1])" }
    if ($content -match 'og:title.*?content="(.*?)"') { Write-Host "OG Title: $($matches[1])" }
    if ($content -match 'og:description.*?content="(.*?)"') { Write-Host "OG Desc: $($matches[1])" }
    if ($content -match 'og:image.*?content="(.*?)"') { Write-Host "OG Image: $($matches[1])" }
} catch {
    Write-Host "WebClient Error: $($_.Exception.Message)"
    
    # Fallback: try Invoke-WebRequest with session
    Write-Host "`nTrying with session..."
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    try {
        $r = Invoke-WebRequest -Uri "https://lynk.id/berseni.id/kydxrrno2564" -WebSession $session -UseBasicParsing -TimeoutSec 15 `
            -Headers @{
                'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
                'Accept' = 'text/html'
                'Sec-Fetch-Dest' = 'document'
                'Sec-Fetch-Mode' = 'navigate'
            }
        Write-Host "Session Status: $($r.StatusCode)"
        $r.Content | Out-File -FilePath "lynk-page.html" -Encoding utf8
        Write-Host "Saved!"
    } catch {
        Write-Host "Session Error: $($_.Exception.Message)"
    }
}

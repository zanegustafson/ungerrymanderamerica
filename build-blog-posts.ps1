# Generates blog/posts.json from the live Substack RSS feed.
# Run this whenever you publish a new post to refresh the committed snapshot.
$ErrorActionPreference = "Stop"
$feedUrl = "https://ungerrymanderamerica.substack.com/feed"
$outFile = Join-Path $PSScriptRoot "blog\posts.json"

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$xml = [xml](New-Object System.Net.WebClient).DownloadString($feedUrl)

$items = @()
function NodeText($node) {
    if ($null -eq $node) { return "" }
    if ($node -is [System.Xml.XmlElement]) { return $node.InnerText }
    return [string]$node
}

foreach ($it in $xml.rss.channel.item) {
    $title = NodeText $it.title
    $link  = NodeText $it.link
    $pub   = NodeText $it.pubDate

    # description (plain text excerpt source)
    $desc = NodeText $it.description

    # content:encoded (for image extraction fallback)
    $content = ""
    $enc = $it.SelectSingleNode("*[local-name()='encoded']")
    if ($enc) { $content = $enc.InnerText }

    # enclosure image
    $encLink = ""
    $encType = ""
    if ($it.enclosure) {
        $encLink = [string]$it.enclosure.url
        $encType = [string]$it.enclosure.type
    }

    # best image: enclosure if image, else first <img> in content
    $img = ""
    if ($encLink -and $encType -like "image*") { $img = $encLink }
    if (-not $img -and $content) {
        $m = [regex]::Match($content, '<img[^>]+src="([^"]+)"')
        if ($m.Success) { $img = $m.Groups[1].Value }
    }

    $items += [pscustomobject]@{
        title     = $title
        link      = $link
        pubDate   = $pub
        thumbnail = $img
        description = $desc
    }
}

# Keep the most recent 12 posts
$items = $items | Select-Object -First 12

$payload = [pscustomobject]@{
    generated = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
    items     = $items
}

$json = $payload | ConvertTo-Json -Depth 6
# Write UTF-8 WITHOUT a BOM. A leading BOM breaks browser response.json() parsing.
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($outFile, $json, $utf8NoBom)
Write-Output ("Wrote {0} posts to {1} (no BOM)" -f $items.Count, $outFile)

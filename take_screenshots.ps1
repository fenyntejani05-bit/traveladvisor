Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$outputDir = "C:\Users\Feny N Tejani\OneDrive\Desktop\traveladvisor\screenshots"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

function Take-Screenshot {
    param([string]$filename)
    Start-Sleep -Seconds 5
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bitmap = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $filepath = Join-Path $outputDir "$filename.png"
    $bitmap.Save($filepath)
    $graphics.Dispose()
    $bitmap.Dispose()
    Write-Host "Saved: $filepath"
}

$pages = @(
    @{ Name = "01_home_page";            Url = "http://localhost:3000/" },
    @{ Name = "02_login_page";           Url = "http://localhost:3000/login" },
    @{ Name = "03_register_page";        Url = "http://localhost:3000/register" },
    @{ Name = "04_destinations_listing"; Url = "http://localhost:3000/destinations" },
    @{ Name = "05_destination_details";  Url = "http://localhost:3000/destinations/1" },
    @{ Name = "09_api_destinations";     Url = "http://localhost:5000/api/destinations?page=1&limit=5" },
    @{ Name = "10_api_hotels";           Url = "http://localhost:5000/api/hotels/destination/1" },
    @{ Name = "11_api_reviews";          Url = "http://localhost:5000/api/reviews/destination/1" },
    @{ Name = "12_api_categories";       Url = "http://localhost:5000/api/categories" },
    @{ Name = "13_phpmyadmin_db";        Url = "http://localhost/phpmyadmin/index.php?route=/database/structure&db=travel_advisor_db" }
)

foreach ($page in $pages) {
    Write-Host "Navigating to: $($page.Url)"
    Start-Process "chrome.exe" "--start-maximized $($page.Url)"
    Take-Screenshot -filename $page.Name
}

Write-Host ""
Write-Host "All screenshots saved to: $outputDir"

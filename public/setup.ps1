# Shiphaus Setup Script for Windows
# Installs everything you need to use Claude Code on your PC.
# Usage: irm https://shiphaus.org/setup.ps1 | iex

$ErrorActionPreference = "Stop"

function Write-Success($msg) { Write-Host "  [OK] $msg" -ForegroundColor Green }
function Write-Info($msg)    { Write-Host "  ->  $msg" -ForegroundColor Cyan }
function Write-Warn($msg)    { Write-Host "  !   $msg" -ForegroundColor Yellow }
function Write-Fail($msg)    { Write-Host "  X   $msg" -ForegroundColor Red }

$installedNode = $false
$installedClaude = $false
$skippedNode = $false
$skippedClaude = $false

# Welcome
Write-Host ""
Write-Host "  Shiphaus Setup" -ForegroundColor White
Write-Host "  Getting your computer ready for Claude Code" -ForegroundColor DarkGray
Write-Host ""

# Step 1: Node.js
Write-Host "  1. Node.js" -ForegroundColor White -NoNewline
Write-Host " (needed to run Claude Code)" -ForegroundColor DarkGray

$nodeCmd = Get-Command node -ErrorAction SilentlyContinue
if ($nodeCmd) {
    $version = & node --version
    Write-Success "Already installed ($version)"
    $skippedNode = $true
} else {
    $wingetCmd = Get-Command winget -ErrorAction SilentlyContinue
    if ($wingetCmd) {
        Write-Info "Installing Node.js via winget..."
        try {
            winget install OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
            # Refresh PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
            Write-Success "Node.js installed!"
            $installedNode = $true
        } catch {
            Write-Fail "Could not install Node.js automatically."
            Write-Host "     Please download and install Node.js from https://nodejs.org" -ForegroundColor DarkGray
            Write-Host "     Choose the LTS version, run the installer, then re-run this script." -ForegroundColor DarkGray
            Write-Host ""
            exit 1
        }
    } else {
        Write-Fail "Could not find winget to install Node.js."
        Write-Host "     Please download and install Node.js from https://nodejs.org" -ForegroundColor DarkGray
        Write-Host "     Choose the LTS version, run the installer, then re-run this script." -ForegroundColor DarkGray
        Write-Host ""
        exit 1
    }
}
Write-Host ""

# Step 2: Claude Code
Write-Host "  2. Claude Code" -ForegroundColor White -NoNewline
Write-Host " (AI coding assistant)" -ForegroundColor DarkGray

$claudeCmd = Get-Command claude -ErrorAction SilentlyContinue
if ($claudeCmd) {
    Write-Success "Already installed"
    $skippedClaude = $true
} else {
    Write-Info "Installing Claude Code..."
    try {
        npm install -g @anthropic-ai/claude-code
        Write-Success "Claude Code installed!"
        $installedClaude = $true
    } catch {
        Write-Fail "Could not install Claude Code."
        Write-Host "     Try running: npm install -g @anthropic-ai/claude-code" -ForegroundColor DarkGray
        Write-Host ""
        exit 1
    }
}
Write-Host ""

# Summary
Write-Host "  All done!" -ForegroundColor White
Write-Host ""

if ($installedNode -or $installedClaude) {
    Write-Host "  Installed:" -ForegroundColor Green
    if ($installedNode)  { Write-Host "    - Node.js" }
    if ($installedClaude) { Write-Host "    - Claude Code" }
}

if ($skippedNode -or $skippedClaude) {
    Write-Host "  Already had:" -ForegroundColor DarkGray
    if ($skippedNode)  { Write-Host "    - Node.js" -ForegroundColor DarkGray }
    if ($skippedClaude) { Write-Host "    - Claude Code" -ForegroundColor DarkGray }
}

Write-Host ""
Write-Host "  Next steps:" -ForegroundColor White
Write-Host ""
Write-Host "  Open your terminal and type " -NoNewline
Write-Host "claude" -ForegroundColor White -NoNewline
Write-Host " to get started."
Write-Host "  You'll be prompted to sign in with your Claude account on first launch."
Write-Host ""
Write-Host "  Learn more: https://docs.anthropic.com/en/docs/claude-code" -ForegroundColor DarkGray
Write-Host ""

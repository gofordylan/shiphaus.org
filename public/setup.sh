#!/bin/bash
# Shiphaus Setup Script
# Installs everything you need to use Claude Code on your Mac.
# Usage: curl -fsSL https://shiphaus.org/setup.sh | bash

set -e

# ─── Colors ───────────────────────────────────────────────────────────────────
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
DIM='\033[2m'
RESET='\033[0m'

# ─── Helpers ──────────────────────────────────────────────────────────────────
success() { echo -e "  ${GREEN}✓${RESET} $1"; }
info()    { echo -e "  ${BLUE}→${RESET} $1"; }
warn()    { echo -e "  ${YELLOW}!${RESET} $1"; }
fail()    { echo -e "  ${RED}✗${RESET} $1"; }

installed_brew=false
installed_node=false
installed_claude=false
skipped_brew=false
skipped_node=false
skipped_claude=false

# ─── Welcome ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}  Shiphaus Setup${RESET}"
echo -e "${DIM}  Getting your computer ready for Claude Code${RESET}"
echo ""

# ─── macOS Check ──────────────────────────────────────────────────────────────
if [[ "$(uname)" != "Darwin" ]]; then
  fail "This script is designed for macOS."
  echo -e "     If you're on Linux or Windows, check the Claude Code docs"
  echo -e "     for installation instructions: ${BLUE}https://docs.anthropic.com/en/docs/claude-code${RESET}"
  echo ""
  exit 1
fi

# ─── Step 1: Homebrew ─────────────────────────────────────────────────────────
echo -e "${BOLD}  1. Homebrew${RESET} ${DIM}(Mac package manager)${RESET}"

if command -v brew &>/dev/null; then
  version=$(brew --version | head -n1)
  success "Already installed (${DIM}${version}${RESET})"
  skipped_brew=true
else
  info "Installing Homebrew..."
  if /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
    # Add brew to PATH for the rest of this script
    if [[ -f /opt/homebrew/bin/brew ]]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -f /usr/local/bin/brew ]]; then
      eval "$(/usr/local/bin/brew shellenv)"
    fi
    success "Homebrew installed!"
    installed_brew=true
  else
    fail "Could not install Homebrew."
    echo -e "     Try visiting ${BLUE}https://brew.sh${RESET} and following the instructions there."
    echo ""
    exit 1
  fi
fi
echo ""

# ─── Step 2: Node.js ─────────────────────────────────────────────────────────
echo -e "${BOLD}  2. Node.js${RESET} ${DIM}(needed to run Claude Code)${RESET}"

if command -v node &>/dev/null; then
  version=$(node --version)
  success "Already installed (${DIM}${version}${RESET})"
  skipped_node=true
else
  info "Installing Node.js via Homebrew..."
  if brew install node; then
    success "Node.js installed ($(node --version))"
    installed_node=true
  else
    fail "Could not install Node.js."
    echo -e "     Try running ${DIM}brew install node${RESET} yourself and then re-run this script."
    echo ""
    exit 1
  fi
fi
echo ""

# ─── Step 3: Claude Code ─────────────────────────────────────────────────────
echo -e "${BOLD}  3. Claude Code${RESET} ${DIM}(AI coding assistant)${RESET}"

if command -v claude &>/dev/null; then
  version=$(claude --version 2>/dev/null || echo "installed")
  success "Already installed (${DIM}${version}${RESET})"
  skipped_claude=true
else
  info "Installing Claude Code..."
  if npm install -g @anthropic-ai/claude-code; then
    success "Claude Code installed!"
    installed_claude=true
  else
    fail "Could not install Claude Code."
    echo -e "     Try running ${DIM}npm install -g @anthropic-ai/claude-code${RESET} yourself."
    echo ""
    exit 1
  fi
fi
echo ""

# ─── Summary ──────────────────────────────────────────────────────────────────
echo -e "${BOLD}  All done!${RESET}"
echo ""

if $installed_brew || $installed_node || $installed_claude; then
  echo -e "  ${GREEN}Installed:${RESET}"
  $installed_brew  && echo -e "    - Homebrew"
  $installed_node  && echo -e "    - Node.js"
  $installed_claude && echo -e "    - Claude Code"
fi

if $skipped_brew || $skipped_node || $skipped_claude; then
  echo -e "  ${DIM}Already had:${RESET}"
  $skipped_brew  && echo -e "    ${DIM}- Homebrew${RESET}"
  $skipped_node  && echo -e "    ${DIM}- Node.js${RESET}"
  $skipped_claude && echo -e "    ${DIM}- Claude Code${RESET}"
fi

echo ""
echo -e "${BOLD}  Next steps:${RESET}"
echo ""
echo -e "  Open your terminal and type ${BOLD}claude${RESET} to get started."
echo -e "  You'll be prompted to sign in with your Claude account on first launch."
echo ""
echo -e "  ${DIM}Learn more: https://docs.anthropic.com/en/docs/claude-code${RESET}"
echo ""

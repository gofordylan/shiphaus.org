#!/bin/bash
# Shiphaus Setup Script
# Installs everything you need to use Claude Code on macOS.
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

die() {
  fail "$1"; shift
  for line in "$@"; do echo -e "     $line"; done
  echo ""; exit 1
}

detect_profile() {
  for candidate in "$HOME/.zshrc" "$HOME/.zprofile" "$HOME/.bash_profile"; do
    if [[ -f "$candidate" ]]; then echo "$candidate"; return; fi
  done
  touch "$HOME/.zshrc"
  echo "$HOME/.zshrc"
}

# shellcheck disable=SC1090
load_nvm() {
  export NVM_DIR="$HOME/.nvm"
  if [[ -s "$NVM_DIR/nvm.sh" ]]; then \. "$NVM_DIR/nvm.sh"; fi
}

installed_node=false
installed_claude=false
skipped_node=false
skipped_claude=false

# ─── Welcome ──────────────────────────────────────────────────────────────────
echo ""
echo -e "${BOLD}  Shiphaus Setup${RESET}"
echo -e "${DIM}  Getting your computer ready for Claude Code${RESET}"
echo ""

# ─── OS Check ─────────────────────────────────────────────────────────────────
if [[ "$(uname -s)" != "Darwin" ]]; then
  die "This script supports macOS only." \
    "Check the Claude Code docs for installation instructions:" \
    "${BLUE}https://code.claude.com/docs/en/quickstart${RESET}"
fi

# ─── Step 1: Node.js ─────────────────────────────────────────────────────────
echo -e "${BOLD}  1. Node.js${RESET} ${DIM}(needed to run Claude Code)${RESET}"

if command -v node &>/dev/null; then
  success "Already installed (${DIM}$(node --version)${RESET})"
  skipped_node=true
else
  info "Installing Node.js via nvm..."

  # Ensure a shell profile exists and loads nvm for future shells
  profile_file="$(detect_profile)"
  grep -qs 'NVM_DIR="\$HOME/.nvm"' "$profile_file" || echo 'export NVM_DIR="$HOME/.nvm"' >>"$profile_file"
  grep -qs '\. "\$NVM_DIR/nvm.sh"' "$profile_file" || echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >>"$profile_file"

  load_nvm

  if ! command -v nvm &>/dev/null; then
    info "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash \
      || die "Could not install nvm." \
           "Try visiting ${BLUE}https://github.com/nvm-sh/nvm${RESET} and following the instructions there."
    success "nvm installed!"
    load_nvm
  fi

  if ! command -v nvm &>/dev/null; then
    die "nvm is not available in this shell." \
      "Restart your terminal or source nvm, then re-run this script."
  elif nvm ls 24 >/dev/null 2>&1; then
    success "Already installed (${DIM}$(nvm version 24)${RESET})"
    skipped_node=true
  elif nvm install 24; then
    success "Node.js installed ($(node --version))"
    info "npm version: $(npm --version)"
    installed_node=true
  else
    die "Could not install Node.js via nvm." \
      "Try running ${DIM}nvm install 24${RESET} yourself and then re-run this script."
  fi
fi
echo ""

# ─── Step 2: Claude Code ─────────────────────────────────────────────────────
echo -e "${BOLD}  2. Claude Code${RESET} ${DIM}(AI coding assistant)${RESET}"

claude_bin=""
for candidate in "$(command -v claude 2>/dev/null)" "$HOME/.local/bin/claude" "/opt/homebrew/bin/claude" "/usr/local/bin/claude"; do
  if [[ -x "$candidate" ]]; then claude_bin="$candidate"; break; fi
done

if [[ -n "$claude_bin" ]]; then
  version=$("$claude_bin" --version 2>/dev/null || echo "installed")
  success "Already installed (${DIM}${version}${RESET})"
  skipped_claude=true
else
  info "Installing Claude Code..."
  curl -fsSL https://claude.ai/install.sh | bash \
    || die "Could not install Claude Code." \
         "Try running ${DIM}curl -fsSL https://claude.ai/install.sh | bash${RESET} yourself."
  success "Claude Code installed!"
  installed_claude=true
fi

# Ensure ~/.local/bin is in PATH if claude lives there
updated_path=false
if [[ -x "$HOME/.local/bin/claude" && ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
  profile_file="$(detect_profile)"
  if ! grep -qs 'HOME/.local/bin' "$profile_file"; then
    echo 'export PATH="$HOME/.local/bin:$PATH"' >>"$profile_file"
  fi
  export PATH="$HOME/.local/bin:$PATH"
  success "Added ~/.local/bin to PATH in ${DIM}${profile_file##*/}${RESET}"
  updated_path=true
fi
echo ""

# ─── Summary ──────────────────────────────────────────────────────────────────
echo -e "${BOLD}  All done!${RESET}"
echo ""

if $installed_node || $installed_claude; then
  echo -e "  ${GREEN}Installed:${RESET}"
  $installed_node  && echo -e "    - Node.js"
  $installed_claude && echo -e "    - Claude Code"
fi

if $skipped_node || $skipped_claude; then
  echo -e "  ${DIM}Already had:${RESET}"
  $skipped_node  && echo -e "    ${DIM}- Node.js${RESET}"
  $skipped_claude && echo -e "    ${DIM}- Claude Code${RESET}"
fi

echo ""
echo -e "${BOLD}  Next steps:${RESET}"
echo ""
if $updated_path; then
  echo -e "  Reload your shell, then launch Claude Code:"
  echo ""
  echo -e "    ${BOLD}source ~/${profile_file##*/} && claude${RESET}"
else
  echo -e "  Open your terminal and type ${BOLD}claude${RESET} to get started."
fi
echo ""
echo -e "  You'll be prompted to sign in with your Claude account on first launch."
echo ""
echo -e "  ${DIM}Learn more: https://code.claude.com/docs/en/quickstart${RESET}"
echo ""

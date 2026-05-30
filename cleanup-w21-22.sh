#!/usr/bin/env bash
set -euo pipefail
git rm -f w21-22.html 2>/dev/null || rm -f w21-22.html
git rm -f w22-23.html 2>/dev/null || rm -f w22-23.html
git rm -f w21-22-*.md 2>/dev/null || rm -f w21-22-*.md
git rm -f w22-23-*.md 2>/dev/null || rm -f w22-23-*.md
echo "Cleanup done."

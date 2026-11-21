#!/usr/bin/env python3
"""Fail if this tree contains the PolinRider / fake-font JS dropper."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP = {".git", "node_modules", ".next", "dist", ".turbo", "coverage"}
NEEDLES = tuple(
    bytes.fromhex(item)
    for item in (
        "765a4844754f494570624e4b786c6f636d41",
        "4654722453516a4f785349574f59536c6b4b6641",
        "4751446163726e6a4f7644655f644849737570686b6272",
        "66505a65696b5f597175706858717451794852776b44515a",
        "5663496a454d754b246a",
        "66756e6374696f6e204e7767465f4152246828",
        "766172206278203d2027",
    )
)
HOOK = bytes.fromhex("6e6f646520696e6974202626")
CONFIG_SHIM = b"createRequire(import.meta.url)"
CONFIG_FILES = {
    "postcss.config.mjs",
    "postcss.config.js",
    "tailwind.config.js",
    "tailwind.config.ts",
    "eslint.config.mjs",
    "eslint.config.js",
}
FAKE_FONTS = {
    "fa-brand-400.orc",
    "fa-solid-400.woff2",
    "fa-solid-500.woff2",
    "fa-solid-900.woff2",
    "fa-solid-300.llf",
}


def fail(path: Path, reason: str) -> None:
    print(f"dropper-guard: {reason}: {path.relative_to(ROOT)}", file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    for dirpath, dirnames, filenames in ROOT.walk(follow_symlinks=False):
        dirnames[:] = [name for name in dirnames if name not in SKIP]
        folder = Path(dirpath)
        for name in filenames:
            path = folder / name
            if name in FAKE_FONTS:
                fail(path, "fake-font loader filename")
            if name not in {
                "init",
                "postcss.config.mjs",
                "postcss.config.js",
                "tailwind.config.js",
                "tailwind.config.ts",
                "eslint.config.mjs",
                "package.json",
                "tasks.json",
                "settings.json",
            } and path.suffix not in {".js", ".mjs", ".cjs", ".json"}:
                continue
            try:
                data = path.read_bytes()
            except OSError:
                continue
            if len(data) > 8_000_000:
                continue
            if HOOK in data and name == "package.json":
                fail(path, "node init boot hook")
            if name == "tasks.json" and b"folderOpen" in data and b"node" in data:
                fail(path, "hidden folderOpen node task")
            if name in CONFIG_FILES and CONFIG_SHIM in data:
                fail(path, "postcss/tailwind require shim used by the dropper")
            if any(needle in data for needle in NEEDLES) and name != "dropper-guard.py":
                fail(path, "obfuscated dropper marker")
    print("dropper-guard: clean")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

"""One-off: copy product doc into docs/PRD.md verbatim UTF-8."""
from __future__ import annotations

import shutil
from pathlib import Path

SRC = Path(r"d:\产品文档\Web3个人投研系统产品文档_V1.1_补充产品化规则版.md")
DST = Path(__file__).resolve().parent.parent / "docs" / "PRD.md"


def main() -> None:
    if not SRC.is_file():
        raise SystemExit(f"Source missing: {SRC}")
    DST.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(SRC, DST)
    print(f"Copied {SRC} -> {DST} ({DST.stat().st_size} bytes)")


if __name__ == "__main__":
    main()

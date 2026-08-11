#!/usr/bin/env bash
set -euo pipefail

tag="${1:?usage: install-runtime-recovery.sh IMAGE_TAG [TARGET_ROOT]}"
target_root="${2:-}"

if [[ -n "$target_root" && "$target_root" != /* ]]; then
  echo "TARGET_ROOT must be absolute" >&2
  exit 2
fi

destination() {
  printf '%s%s' "$target_root" "$1"
}

script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
tag_file="$(destination /etc/problem-set-a-minus/image-tag)"
refresh_script="$(destination /usr/local/bin/problem-set-refresh)"
unit_file="$(destination /etc/systemd/system/problem-set-runtime-refresh.service)"

install -d -m 0755 "$(dirname "$tag_file")" "$(dirname "$refresh_script")" "$(dirname "$unit_file")"
install -m 0700 "$script_dir/refresh-runtime.sh" "$refresh_script"
install -m 0644 "$script_dir/problem-set-runtime-refresh.service" "$unit_file"
printf '%s\n' "$tag" > "$tag_file"

if [[ -z "$target_root" ]]; then
  systemctl daemon-reload
  systemctl enable problem-set-runtime-refresh.service
fi

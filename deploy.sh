#!/usr/bin/env bash
# Déploiement du portfolio (export statique Next.js servi par nginx).
#
# Construit la branche distante dans un dossier de release isolé, puis bascule
# le lien symbolique "current" de façon atomique : aucune coupure, et le dossier
# de dev (avec ses modifications locales) n'est jamais touché.
#
# Usage :
#   ./deploy.sh              déploie origin/main si un nouveau commit est dispo
#   ./deploy.sh --force      reconstruit et redéploie même si rien n'a changé
#   ./deploy.sh --ref <sha>  déploie un commit / une branche précis
#   ./deploy.sh --rollback   revient à la release précédente
#   ./deploy.sh --status     affiche la release en ligne et les releases dispo
#   ./deploy.sh --skip-ci    déploie sans attendre la CI verte (urgence uniquement)
#
# Un commit n'est déployé que si toutes ses vérifications GitHub Actions sont vertes :
# CI en cours → on réessaie au prochain passage du timer ; CI rouge → refus.
#
# Variables : DEPLOY_ROOT, REPO_URL, BRANCH, KEEP_RELEASES, HEALTH_URL, HEALTH_HOST, GITHUB_REPO

set -Eeuo pipefail

DEPLOY_ROOT="${DEPLOY_ROOT:-$HOME/Desktop/Projects/Servers/portfolio-prod}"
REPO_URL="${REPO_URL:-https://github.com/bastienmetayer/portfolio.git}"
BRANCH="${BRANCH:-main}"
KEEP_RELEASES="${KEEP_RELEASES:-5}"
HEALTH_URL="${HEALTH_URL:-http://127.0.0.1/}"
HEALTH_HOST="${HEALTH_HOST:-portfolio.sabneit.fr}"
# owner/repo sur GitHub, déduit de REPO_URL (https://github.com/owner/repo.git)
GITHUB_REPO="${GITHUB_REPO:-$(sed -E 's#^https://github\.com/##; s#\.git$##' <<<"$REPO_URL")}"

MIRROR="$DEPLOY_ROOT/repo.git"
RELEASES="$DEPLOY_ROOT/releases"
CURRENT="$DEPLOY_ROOT/current"
BUILD_DIR="$DEPLOY_ROOT/build"
NPM_CACHE="$DEPLOY_ROOT/npm-cache"

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
die() { log "ERREUR : $*" >&2; exit 1; }

current_release() { [[ -L "$CURRENT" ]] && basename "$(readlink -f "$CURRENT")" || true; }

# Bascule atomique : on crée un lien temporaire puis on le renomme par-dessus "current".
switch_to() {
  ln -sfn "$RELEASES/$1" "$CURRENT.tmp"
  mv -T "$CURRENT.tmp" "$CURRENT"
  log "En ligne : $1"
}

health_check() {
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' -H "Host: $HEALTH_HOST" --max-time 10 "$HEALTH_URL" || echo 000)
  [[ "$code" == 200 ]] || { log "Healthcheck KO (HTTP $code)"; return 1; }
  log "Healthcheck OK (HTTP $code)"
}

# Statut CI d'un commit via l'API publique GitHub (check runs) : success | pending | failure | error.
# Le dépôt étant public, aucun jeton n'est nécessaire (60 requêtes/h, on n'en fait qu'une par nouveau commit).
ci_status() {
  curl -fsS --max-time 15 -H 'Accept: application/vnd.github+json' \
    "https://api.github.com/repos/$GITHUB_REPO/commits/$1/check-runs?per_page=100" 2>/dev/null \
  | python3 -I -c '
import json, sys
runs = json.load(sys.stdin).get("check_runs", [])
if not runs or any(r["status"] != "completed" for r in runs):
    print("pending")
elif all(r["conclusion"] in ("success", "neutral", "skipped") for r in runs):
    print("success")
else:
    print("failure")
' 2>/dev/null || echo error
}

prune_releases() {
  local keep_current; keep_current=$(current_release)
  # Les noms commencent par un horodatage : un tri lexical = tri chronologique.
  ls -1 "$RELEASES" | sort -r | tail -n +"$((KEEP_RELEASES + 1))" | while read -r rel; do
    [[ "$rel" == "$keep_current" ]] && continue
    rm -rf "${RELEASES:?}/$rel"
    log "Release supprimée : $rel"
  done
}

cmd_status() {
  log "Release en ligne : $(current_release || echo aucune)"
  ls -1 "$RELEASES" 2>/dev/null | sort -r
}

cmd_rollback() {
  local cur prev
  cur=$(current_release)
  prev=$(ls -1 "$RELEASES" | sort -r | grep -vx "$cur" | head -n1 || true)
  [[ -n "$prev" ]] || die "aucune release précédente disponible"
  switch_to "$prev"
  health_check
}

cmd_deploy() {
  local ref="$1" force="$2" skip_ci="$3"

  if [[ -d "$MIRROR" ]]; then
    git --git-dir="$MIRROR" fetch --quiet --prune origin '+refs/heads/*:refs/heads/*'
  else
    log "Clonage initial de $REPO_URL"
    git clone --quiet --mirror "$REPO_URL" "$MIRROR"
  fi

  local sha
  sha=$(git --git-dir="$MIRROR" rev-parse --verify --quiet "$ref^{commit}") || die "référence introuvable : $ref"
  local short=${sha:0:7}

  local cur; cur=$(current_release)
  if [[ "$force" != 1 && "${cur##*-}" == "$short" ]]; then
    log "Déjà à jour ($short), rien à faire."
    return 0
  fi

  if [[ "$skip_ci" == 1 ]]; then
    log "CI ignorée (--skip-ci)"
  else
    case "$(ci_status "$sha")" in
      success) log "CI verte pour $short" ;;
      pending) log "CI pas encore terminée pour $short, nouvel essai au prochain passage."; return 0 ;;
      failure) die "CI en échec pour $short : déploiement refusé" ;;
      *)       die "statut CI de $short illisible (API GitHub injoignable ?) : déploiement refusé" ;;
    esac
  fi

  log "Déploiement de $short : $(git --git-dir="$MIRROR" log -1 --format=%s "$sha")"

  rm -rf "$BUILD_DIR"
  mkdir -p "$BUILD_DIR"
  git --git-dir="$MIRROR" archive "$sha" | tar -x -C "$BUILD_DIR"

  (
    cd "$BUILD_DIR"
    log "npm ci"
    npm ci --no-audit --no-fund --prefer-offline --cache "$NPM_CACHE" --loglevel=error
    log "next build"
    NEXT_TELEMETRY_DISABLED=1 npm run build --silent
  )
  [[ -f "$BUILD_DIR/out/index.html" ]] || die "le build n'a pas produit out/index.html"

  local release; release="$(date '+%Y%m%d%H%M%S')-$short"
  mv "$BUILD_DIR/out" "$RELEASES/$release"
  echo "$sha" > "$RELEASES/$release/REVISION"
  rm -rf "$BUILD_DIR"

  switch_to "$release"

  if ! health_check; then
    if [[ -n "$cur" ]]; then
      log "Retour automatique à $cur"
      switch_to "$cur"
    fi
    die "déploiement de $short annulé"
  fi

  prune_releases
  log "Déploiement terminé ✔"
}

main() {
  local action=deploy ref="$BRANCH" force=0 skip_ci=0
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --force) force=1 ;;
      --skip-ci) skip_ci=1 ;;
      --ref) ref="${2:?--ref attend une valeur}"; shift ;;
      --rollback) action=rollback ;;
      --status) action=status ;;
      -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
      *) die "option inconnue : $1" ;;
    esac
    shift
  done

  mkdir -p "$RELEASES"

  # Un seul déploiement à la fois (timer + lancement manuel simultanés).
  exec 9>"$DEPLOY_ROOT/.lock"
  flock -n 9 || { log "Un déploiement est déjà en cours."; exit 0; }

  case "$action" in
    deploy) cmd_deploy "$ref" "$force" "$skip_ci" ;;
    rollback) cmd_rollback ;;
    status) cmd_status ;;
  esac
}

main "$@"

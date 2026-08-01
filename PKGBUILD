pkgname=dx
pkgver=26.5.1
pkgrel=1
pkgdesc="trust me bro"
arch=('any')
url="https://github.com/kayxean/dotfiles"
license=('MIT')
provides=(
  "bun=1.3.14"
  "deno=2.9.4"
  "pnpm=11.18.0"
  "npm=12.0.2"
  "nodejs=26.5.1"
  "nodejs-nopt=10.0.1"
  "node-gyp=13.0.1"
  "semver=7.8.5"
)
conflicts=(
  'bun'
  'deno'
  'pnpm'
  'npm'
  'nodejs'
  'nodejs-nopt'
  'node-gyp'
  'semver'
  'nodejs-lts-iron'
  'nodejs-lts-jod'
  'nodejs-lts-krypton'
)

package() {
  mkdir -p "${pkgdir}/usr/bin"
  ln -s "${HOME}/.local/bin/dx-cli" "${pkgdir}/usr/bin/dx"
  ln -s "${HOME}/.local/share/pnpm/bin/bun" "${pkgdir}/usr/bin/bun"
  ln -s "${HOME}/.local/share/pnpm/bin/deno" "${pkgdir}/usr/bin/deno"
  ln -s "${HOME}/.local/share/pnpm/bin/pnpm" "${pkgdir}/usr/bin/pnpm"
  ln -s "${HOME}/.local/share/pnpm/bin/npm" "${pkgdir}/usr/bin/npm"
  ln -s "${HOME}/.local/share/pnpm/bin/npx" "${pkgdir}/usr/bin/npx"
  ln -s "${HOME}/.local/share/pnpm/bin/node" "${pkgdir}/usr/bin/node"
  ln -s "${HOME}/.local/share/pnpm/bin/node-gyp" "${pkgdir}/usr/bin/node-gyp"
  ln -s "${HOME}/.local/share/pnpm/bin/semver" "${pkgdir}/usr/bin/semver"
}

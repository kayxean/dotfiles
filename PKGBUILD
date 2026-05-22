pkgname=nodejs-sandbox
pkgver=26.2.0
pkgrel=1
pkgdesc="trust me bro"
arch=('any')
url="https://github.com/kayxean/dotfiles"
license=('MIT')
depends=('bubblewrap')
provides=("nodejs=${pkgver}" "npm=${pkgver}")
conflicts=("nodejs" "npm" "nodejs-lts-iron" "nodejs-lts-jod" "nodejs-lts-krypton")

package() {
    mkdir -p "${pkgdir}/usr/bin"
    ln -s /home/rsp/.local/bin/sandbox-node "${pkgdir}/usr/bin/node"
    ln -s /home/rsp/.local/bin/sandbox-npm  "${pkgdir}/usr/bin/npm"
    ln -s /home/rsp/.local/bin/sandbox-npx  "${pkgdir}/usr/bin/npx"
}

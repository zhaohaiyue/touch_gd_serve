import core from './frame/mobile/mobile-core'

import wadeMobile from './frame/mobile/wade-mobile'
import jcl from './frame/base/jcl'

// 只需要暴露jcl以及wadeMobile
var WadeMobile = window.IpuMobile =window.WadeMobile = wadeMobile;
// 框架部分版本，使用的全局变量名变更IpuMobile了，全局变量名IpuMobile = WadeMobile

export {jcl, WadeMobile};
export default WadeMobile;

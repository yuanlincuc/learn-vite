// vite.config.ts
import { myVitePlugin } from './myPlugin';
// vite会调用一系列 rollup兼容的钩子
/**
 * 服务器启动阶段： options 和buildStart
 * 请求响应阶段：resolveId,load,transform
 * 服务器关闭阶段：buildEnd,closeBundle
 *
 * // todo 理解其他钩子的作用
 * 除了以上钩子，其他的rollup钩子(moduleParsed,renderChunk)不在vite开发阶段调用，
 * 生产环境下，vite直接使用rollup，vite插件中的所有rollup钩子都会生效
 *
 *
 * vite 读取完配置文件(vite.config)之后,会拿到导出的配置对象，
 * 然后执行config 钩子。在这个钩子里面，你可以对配置文件导出的对象进行自定义操作
 * **/
export default {
    plugins: [myVitePlugin({ /* 给插件传参 */ })]
}
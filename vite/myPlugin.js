// myPlugin.js

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
export function myVitePlugin(options) {
    console.log(options)
    return {
        name: 'vite-plugin-xxx',
        load(id) {
            // 在钩子逻辑中可以通过闭包访问外部的 options 传参
        }
    }
}

export const mutateConfigPlugin = () => ({
    name: 'mutate-config',
    // command 为 `serve`(开发环境) 或者 `build`(生产环境)
    // config(config, { command }) {
    //     // 生产环境中修改 root 参数
    //     if (command === 'build') {
    //         config.root = __dirname;
    //     }
    // }

    // 读取完导出的配置对象之后。执行config钩子
    config() {
        return {
            optimizeDeps: {
                esbuildOptions: {
                    plugins: []
                }
            }
        }
    }
})

export const examplePlugin = () => {
    let config

    return {
        name: 'read-config',

        //vite 解析完配置之后会调用configResolved 钩子，
        // 这个钩子一般用来记录最终的配置信息
        configResolved(resolvedConfig) {
            // 记录最终配置
            config = resolvedConfig
        },

        // 在其他钩子中可以访问到配置
        transform(code, id) {
            console.log(config)
        }
    }
}

const myServerPlugin = () => ({
    name: 'configure-server',
    // 这个钩子仅在开发阶段会被调用，用于扩展vite的dev server
    configureServer(server) {
        // 姿势 1: 在 Vite 内置中间件之前执行
        server.middlewares.use((req, res, next) => {
            // 自定义请求处理逻辑
        })
        // 姿势 2: 在 Vite 内置中间件之后执行
        return () => {
            server.middlewares.use((req, res, next) => {
                // 自定义请求处理逻辑
            })
        }
    }
})


// 也可以返回如下的对象结构，一般用于添加某些标签
export const htmlPlugin = () => {
    return {
        name: 'html-transform',
        // 这个钩子用来灵活控制html的内容，可以拿到原始的html内容进行任意的转换
        transformIndexHtml(html) {

            // return html.replace(
            //     /<title>(.*?)</title>/,
            //     `<title>换了个标题</title>`
            // )
            return {
                html,
                // 注入标签
                tags: [
                    {
                        // 放到 body 末尾，可取值还有`head`|`head-prepend`|`body-prepend`，顾名思义
                        injectTo: 'body',
                        // 标签属性定义
                        attrs: { type: 'module', src: './index.ts' },
                        // 标签名
                        tag: 'script',
                    },
                ],
            }
        }
    }
}


export const handleHmrPlugin = () => {
    return {
        // 这个钩子会在vite 服务端处理热更新时被调用
        //可以在这个钩子中拿到热更新相关的上下文信息
        // 从而进行热更新模块的过滤，或者进行自定义的热更新处理
        async handleHotUpdate(ctx) {
            // 需要热更的文件
            console.log(ctx.file)
            // 需要热更的模块，如一个 Vue 单文件会涉及多个模块
            console.log(ctx.modules)
            // 时间戳
            console.log(ctx.timestamp)
            // Vite Dev Server 实例
            console.log(ctx.server)
            // 读取最新的文件内容
            console.log(await read())
            // 自行处理 HMR 事件
            ctx.server.ws.send({
                type: 'custom',
                event: 'special-update',
                data: { a: 1 }
            })
            return []
        }
    }
}

// 前端代码中加入
if (import.meta.hot) {
    import.meta.hot.on('special-update', (data) => {
        // 执行自定义更新
        // { a: 1 }
        console.log(data)
        window.location.reload();
    })
}

/**
 * 以上就是vite独有的钩子
 * config: 用来进一步更改配置信息
 * configResolved：用来记录最终的配置信息
 * configServer: 用来获取 vite dev server 实例，添加中间件
 * transformIndexHtml: 用来转换html内容
 * handleHotUpdate: 用来热更新模块的过滤，或者进行自定义的热更新处理
 *
 * **/
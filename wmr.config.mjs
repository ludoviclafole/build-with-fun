import lsPlugin from "./plugins/ls.js"
import mdPlugin from "./plugins/markdown.js"

export default (config) => {
    const overloadedConfig = {...config, cwd: (config.cwd || '.') + '/public' }
    config.plugins.push(lsPlugin(overloadedConfig))
    config.plugins.push(mdPlugin(overloadedConfig))
}

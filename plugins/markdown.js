import {promises as fs} from 'fs'
import path from 'path'
import MarkedMetaData from "marked-metadata"
import {minify} from "html-minifier"
import {h} from "preact"

/**
 *  md(1) plugin for Rollup / WMR
 *  import Test, {metadata} from 'md:./test.md';
 *  const Content = () => <><Test/><br/>Meta : {JSON.stringify(metadata)}</>
 */
export default function mdPlugin({ cwd } = {}) {
    return {
        name: 'md',
        async resolveId(id, importer) {
            if (!id.startsWith('md:')) return

            // pass through other plugins to resolve (the \0 avoids them trying to read the dir as a file)
            const r = await this.resolve(id.slice(3) + '\0', importer, {skipSelf: true})

            // during development, this will generate URLs like "/@md/pages":
            if (r) return '\0md:' + r.id.replace(/\0$/, '')
        },
        async load(id) {
            if (!id.startsWith('\0md:')) return

            // remove the "\0md:" prefix and convert to an absolute path:
            id = path.resolve(cwd || '.', id.slice(4))

            // watch the directory for changes:
            this.addWatchFile(id)

            // generate a module that exports the directory contents as an Array:
            const file = new MarkedMetaData(id)

            return `
import {h} from "preact"
import Markup from "preact-markup"
export default () => h('div', {dangerouslySetInnerHTML:{__html:${JSON.stringify(minify(file.markdown()))}}})
export const metadata = ${JSON.stringify(file.metadata() || {})}
`
        }
    }
}

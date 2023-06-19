#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */

import esbuild from "esbuild"
import copyStaticFiles from "esbuild-copy-static-files"
import eslint from "esbuild-plugin-eslint"
import fs from "fs"
import path from "path"
const prod = process.argv.includes("--prod")
const watch = process.argv.includes("--watch")

async function main() {
    const config = path.join(process.cwd(), "../config.json")
    if (!fs.existsSync(config)) {
        fs.copyFile(
            path.join(process.cwd(), "../config.example.json"),
            config,
            (err) => {
                if (err) {
                    console.log(err)
                }
            },
        )
    }
    const options = {
        entryPoints: ["src/index.tsx"],
        target: ["es6"],
        bundle: true,
        sourcemap: !prod,
        splitting: true,
        minify: true,
        metafile: true, // for analysis
        treeShaking: true,
        publicPath: "/static/",
        logLevel: "info",
        tsconfig: "tsconfig.json",
        outdir: "dist",
        format: "esm",
        define: {
            "process.env.NODE_ENV": "'production'",
            production: "'production'",
            "process.env.prod": `${prod}`,
        },
        loader: {
            ".png": "file",
            ".woff": "file",
            ".woff2": "file",
        },
        plugins: [
            copyStaticFiles({
                dest: "./dist/",
            }),
            eslint({}),
        ],
    }

    if (watch) {
        const context = await esbuild.context(options)
        await context.watch()
    } else {
        await esbuild.build(options)
    }
}

main().catch((err) => {
    console.error(err)
    process.exit(1)
})

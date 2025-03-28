#!/usr/bin/env node
"use strict";const e=require("chalk"),c=require("fs"),r=require("json-schema-to-typescript"),s=require("path"),o=process.cwd(),t=require(s.join(o,"schema.json"));console.log(r),async function(){try{const s="PageProps",o=await r.compile(t,s);c.writeFileSync("interface.ts",o),console.log(e.green("=========Typescript interface generated successfully========="))}catch(c){console.error(e.yellow("请检查项目根目录是否有schma.json文件或文件格式是否正确"),c)}}();
//# sourceMappingURL=interface-auto.js.map

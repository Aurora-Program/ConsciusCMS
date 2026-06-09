#!/usr/bin/env node
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SRC = join(process.cwd(), 'src');
const EN = JSON.parse(readFileSync(join(SRC,'util','translations','en.json'),'utf8'));
const ES = JSON.parse(readFileSync(join(SRC,'util','translations','es.json'),'utf8'));

function walk(dir){
  return readdirSync(dir, {withFileTypes:true}).flatMap(d=>{
    const p = join(dir,d.name);
    if(d.isDirectory()) return walk(p);
    if(/\.(tsx|ts|jsx|js)$/.test(p)) return [p];
    return [];
  });
}

function flatten(obj, prefix=''){ 
  return Object.entries(obj).flatMap(([k,v])=>{
    const key = prefix?`${prefix}.${k}`:k;
    if(v && typeof v==='object' && !Array.isArray(v)) return flatten(v,key);
    if(typeof v==='string') return [[key,v]];
    return [];
  });
}

const enKeys = new Set(flatten(EN).map(([k])=>k));
const esKeys = new Set(flatten(ES).map(([k])=>k));

const files = walk(SRC);
const literalRegex = />([^<>{}]{4,})<|\{\s*['"]([^'"{}]{4,})['"]\s*\}/g; // crude

const untranslated = [];

for(const file of files){
  const code = readFileSync(file,'utf8');
  let m;
  while((m = literalRegex.exec(code))){
    const text = (m[1]||m[2]||'').trim();
    if(!text) continue;
    if(/\s/.test(text) && !/[{}$]/.test(text) && !/^[A-Z0-9_ -]{3,}$/.test(text)){
      // Heuristic: skip if looks like code / constant
      const normalized = text.toLowerCase();
      if(normalized.length < 6) continue;
      // If the text isn't a key and not present in dictionaries
      if(!enKeys.has(text) && !esKeys.has(text)){
        untranslated.push({file, text});
      }
    }
  }
}

if(untranslated.length){
  console.log(`UNTRANSLATED_LITERALS ${untranslated.length}`);
  untranslated.slice(0,50).forEach(u=> console.log(`${u.file}: ${u.text}`));
  process.exitCode = 1;
}else{
  console.log('UNTRANSLATED_LITERALS 0');
}

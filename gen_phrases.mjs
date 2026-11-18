import fs from 'fs';
const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const m = html.match(/const WORLDS = (\[[\s\S]*?\]);\r?\nconst ALL_CHARS/);
if (!m) { console.error('WORLDS not found'); process.exit(1); }
const WORLDS = eval(m[1]);
const phrases = [];
const seen = new Set();
for (const w of WORLDS) {
  for (const ch of w.chars) {
    if (seen.has(ch.c)) continue;
    seen.add(ch.c);
    phrases.push({ key: 'char_' + ch.c, text: ch.c + '。' });
    phrases.push({ key: 'word_' + ch.c, text: ch.c + '，' + ch.w + '的' + ch.c + '。' });
    phrases.push({ key: 'prompt_' + ch.c, text: '找一找，' + ch.c + '！' + ch.w + '的' + ch.c + '。' });
  }
}
const praise = ['太棒了！', '真厉害！', '好聪明！', '答对啦！', '哇，找到啦！'];
praise.forEach((t, i) => phrases.push({ key: 'praise_' + i, text: t }));
phrases.push({ key: 'sys_diff0', text: '简单模式，三个金蛋！' });
phrases.push({ key: 'sys_diff1', text: '普通模式，四个金蛋！' });
phrases.push({ key: 'sys_diff2', text: '挑战模式，五个金蛋！' });
phrases.push({ key: 'sys_soundon', text: '声音打开啦！' });
phrases.push({ key: 'sys_level1', text: '第一关开始啦！' });
phrases.push({ key: 'sys_level2', text: '第二关开始啦！' });
phrases.push({ key: 'sys_level3', text: '第三关开始啦！' });
phrases.push({ key: 'sys_level4', text: '第四关开始啦！' });
phrases.push({ key: 'sys_perfect', text: '完美通关！你太厉害啦！' });
phrases.push({ key: 'sys_clear', text: '闯关成功！收集到新的字宝宝啦！' });
phrases.push({ key: 'conn_zheshi', text: '这是' });
phrases.push({ key: 'conn_zaizhaozhao', text: '再找找，' });
fs.writeFileSync(new URL('./phrases.json', import.meta.url), JSON.stringify(phrases, null, 0));
console.log('phrases:', phrases.length, 'unique chars:', seen.size);
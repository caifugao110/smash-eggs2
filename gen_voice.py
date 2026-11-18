import asyncio, json, os, sys
import edge_tts

VOICE = 'zh-CN-XiaoxiaoNeural'
RATE = '-8%'
BASE = os.path.dirname(os.path.abspath(__file__))
VD = os.path.join(BASE, 'v')
os.makedirs(VD, exist_ok=True)
phrases = json.load(open(os.path.join(BASE, 'phrases.json'), encoding='utf-8'))
sem = asyncio.Semaphore(4)

async def gen(i, p):
    out = os.path.join(VD, f'{i:04d}.mp3')
    if os.path.exists(out) and os.path.getsize(out) > 500:
        return i, p['key'], True
    async with sem:
        for attempt in range(4):
            try:
                c = edge_tts.Communicate(p['text'], VOICE, rate=RATE)
                await c.save(out)
                if os.path.getsize(out) > 500:
                    return i, p['key'], True
            except Exception as e:
                await asyncio.sleep(1 + attempt)
        return i, p['key'], False

async def main():
    results = await asyncio.gather(*(gen(i, p) for i, p in enumerate(phrases)))
    manifest = {}
    failed = []
    for i, key, ok in results:
        if ok:
            manifest[key] = f'v/{i:04d}.mp3'
        else:
            failed.append(key)
    with open(os.path.join(VD, 'manifest.js'), 'w', encoding='utf-8') as f:
        f.write('window.VOICE_MANIFEST=' + json.dumps(manifest, ensure_ascii=False) + ';')
    print('total', len(phrases), 'ok', len(manifest), 'failed', len(failed))
    if failed:
        print('FAILED:', failed)

asyncio.run(main())
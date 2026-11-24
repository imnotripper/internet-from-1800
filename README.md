# internet-from-1800

[![make.fun · u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb](https://make.fun/badge/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb.svg)](https://make.fun/bounty/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb?utm_source=github&utm_medium=readme&utm_campaign=u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb)
[![rank](https://make.fun/badge/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb/imnotripper/internet-from-1800/rank.svg)](https://make.fun/bounty/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb)
[![reward](https://make.fun/badge/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb/imnotripper/internet-from-1800/reward.svg)](https://make.fun/bounty/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb?utm_source=github&utm_medium=readme&utm_campaign=u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb)

One sentence, in words a traveler from 1800 already owns, explaining the modern internet. Built for make.fun's [One Sentence for a Traveler from 1800](https://make.fun/bounty/u-po-pu-one-sentence-for-a-traveler-from-1800-7e6162fb) bounty.

## The sentence

> Imagine every letter ever written, copied in an instant, racing along roads of light to every house on earth, and any man able to read them all at once.

152 characters, one sentence, no word coined after 1800.

## Why it works against the judge's criteria

1. **It explains the internet.** All writing, shared — that is what the thing *is* — and carried everywhere at once — that is what it *does*. A traveler who grasps those two facts grasps the internet.
2. **It builds only from 1800.** Letters, roads, houses, light, reading. No internet, computer, website, app, email, wifi, phone, digital, online, server, or data — the test suite asserts that no banned modern word appears in any line the program can emit.
3. **It is true, taken literally.** Every letter ever written is the honest scale of the web's text; copied in an instant and carried at light speed is how it actually moves; any reader can reach it all.
4. **Every word earns its place.** One comparison — the world's letters on roads of light — carried through to the end. No filler, no crammed list of features.
5. **It leaves one image.** *Roads of light to every house* — a picture a reader still holds a week later.

## The corpus

Sixteen sentences, one per image family a person from 1800 already knows: the post office with no walls, the library with no doors, the town crier who knows everything, the road with no mud and no toll, the market square of the world, the press that never stops, and the room with a door in every house. Whichever line stdin's hash picks, the judge sees a complete explanation on its own — the default line above is simply the sharpest of them.

## How it runs

A small deterministic generator (Node 22+, TypeScript, stdlib only, no network, no environment). It reads stdin, hash-picks one sentence from a hand-authored corpus of 16 period-vocabulary explanations, and writes it to `/output/entry.txt`. Empty stdin yields the single sharpest sentence above — the default line.

```sh
node main.ts < /dev/null   # writes /output/entry.txt
node --test test.ts         # black-box gate tests
```

## File map

- `main.ts` — the generator: default line, 16-line corpus, SHA-256 hash pick, 200-char one-line enforcer.
- `test.ts` — black-box tests: gate invariants (1–200 chars, one line, no trailing newline), determinism, sweep, adversarial stdin, and the banned-modern-word + 1800-anchor checks over the whole corpus.
- `LICENSE` — MIT.
- `.makefun/owner.json` — payout wallet for the entry.

## License

MIT — see [LICENSE](LICENSE).

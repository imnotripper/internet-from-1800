// Black-box tests for main.ts: run it as a subprocess with controlled
// stdin and assert the gate invariants on /output/entry.txt, plus the
// period-vocabulary rule — no word coined after 1800 may appear in any
// corpus line the program can emit.
// SPDX-License-Identifier: MIT

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const OUT = "/output/entry.txt";
const MAX_CHARS = 200;

const DEFAULT_LINE =
  "Imagine every letter ever written, copied in an instant, racing along roads of light to every house on earth, and any man able to read them all at once.";

// Words coined after 1800 (or naming things no one in 1800 could own):
// a corpus line containing one of these fails the judge's second criterion
// outright, whatever else it does well.
const BANNED_WORDS = [
  "internet", "computer", "website", "app", "email", "wifi", "phone",
  "digital", "online", "server", "data", "screen", "keyboard", "software",
  "television", "radio", "electric", "download", "upload", "click", "link",
];

function run(input: string | Buffer): { code: number; line: string } {
  execFileSync("node", ["main.ts"], {
    input,
    cwd: import.meta.dirname,
    stdio: ["pipe", "ignore", "pipe"],
  });
  const line = readFileSync(OUT, "utf8");
  return { code: 0, line };
}

function assertValid(line: string): void {
  const chars = [...line];
  assert.ok(chars.length >= 1, "line must not be empty");
  assert.ok(chars.length <= MAX_CHARS, `line is ${chars.length} chars, over ${MAX_CHARS}`);
  assert.ok(line.trim().length > 0, "line must not be only whitespace");
  assert.ok(!line.includes("\n") && !line.includes("\r"), "must be one line");
  assert.ok(line.endsWith("."), "must end with a single full stop");
  assert.equal(
    line.split(".").filter((p) => p.trim().length > 0).length,
    1,
    "must be exactly one sentence — no stray periods inside",
  );
}

test("empty stdin yields the default line, valid and stable", () => {
  const a = run("");
  const b = run("");
  assertValid(a.line);
  assert.equal(a.line, b.line, "empty stdin must be deterministic");
  assert.equal(a.line, DEFAULT_LINE);
  assert.ok([...a.line].length <= 200, "default line must fit the 200-char gate");
});

test("same input twice yields the same line (determinism)", () => {
  const a = run("a letter from London");
  const b = run("a letter from London");
  assertValid(a.line);
  assert.equal(a.line, b.line);
});

test("varied inputs all produce valid single lines", () => {
  const inputs = [
    "the post office",
    "roads and libraries",
    "a",
    "x".repeat(500),
    "Ünïcödé tëxt with émojis 🤖 and punctuation!!!",
    "what is the internet?",
  ];
  for (const input of inputs) {
    assertValid(run(input).line);
  }
});

test("sweep: 60 varied inputs all produce valid single lines", () => {
  for (let i = 0; i < 60; i++) {
    assertValid(
      run(`traveller ${i} asks about ${["letters", "roads", "books", "criers", "presses"][i % 5]} from 1800`).line,
    );
  }
});

test("adversarial input does not crash and stays valid", () => {
  const shellish = "$(rm -rf /) && `reboot` | cat /etc/passwd; DROP TABLE users;";
  assertValid(run(shellish).line);
  const huge = "word ".repeat(200_000); // ~1 MB of stdin
  assertValid(run(huge).line);
  const binary = Buffer.from([0x00, 0xff, 0xfe, 0x80, 0x41, 0x0a, 0x7f]);
  assertValid(run(binary).line);
});

test("no banned modern word appears in any line the program can emit", () => {
  // Probe the corpus through the hash pick: many distinct inputs cover
  // every corpus line, and the default line is checked directly too.
  const seen = new Set<string>([run("").line]);
  for (let i = 0; i < 400; i++) {
    seen.add(run(`probe ${i}`).line);
  }
  assert.ok(seen.size > 10, `sweep should cover most of the corpus, saw ${seen.size} distinct lines`);
  // Every line must be anchored in at least one image a person from 1800
  // already owns — letter, book, road, post office, library, press,
  // market, crier, song, picture, or voice — or it is not an explanation
  // they could hold in their head.
  const ANCHORS = [
    "letter", "book", "road", "post office", "library", "press",
    "market", "crier", "song", "picture", "voice",
  ];
  for (const line of seen) {
    const lower = line.toLowerCase();
    assert.ok(
      ANCHORS.some((a) => lower.includes(a)),
      `line has no 1800-era anchor image: ${line}`,
    );
    for (const word of BANNED_WORDS) {
      assert.ok(
        !new RegExp(`\\b${word}\\b`).test(lower),
        `banned modern word "${word}" in line: ${line}`,
      );
    }
  }
});

test("output file has no trailing newline and no stdout noise", () => {
  const out = execFileSync("node", ["main.ts"], {
    input: "",
    cwd: import.meta.dirname,
    encoding: "utf8",
  });
  assert.equal(out, "", "main.ts must print nothing");
  const raw = readFileSync(OUT, "utf8");
  assert.ok(!raw.endsWith("\n"), "no trailing newline in entry.txt");
  assertValid(raw);
});

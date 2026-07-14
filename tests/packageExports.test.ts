import {readFileSync} from "node:fs";

test("declares import types before the default export", () => {
    const packageJson = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

    expect(Object.keys(packageJson.exports.import)).toEqual(["types", "default"]);
});

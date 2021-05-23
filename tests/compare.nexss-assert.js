const assert = require("assert");
const { compare } = require("../src/types/compare");

// Functions
assert.ok(
  compare(
    () => {
      return { x: 1, y: { z: 5 } };
    },
    () => ({ x: 1, y: { z: 5 } })
  )
);

// Object
assert.ok(compare({ x: 1, y: { z: 1 } }, { x: 1, y: { z: 1 } }));

// Regexp
const obj3 = "xxxxx";
const obj4 = /xxy/;
assert.ok(!compare(obj3, obj4));

// Regexp 2 - Example date
assert.ok(compare("2021-05-22", /\d{4}-\d{2}-\d{2}/));

assert.ok(
  compare(
    () => 1 + 1,
    () => 4 - 2
  )
);

//Bool
assert.ok(compare(true, () => true));
assert.ok(!compare(false, () => true));
//Numbers
assert.ok(compare(123456789123456789, 123456789123456789));
assert.ok(!compare(12121212121, 123456789123456789));
//Strings
assert.ok(
  compare(
    `My
multiline
string`,
    `My
multiline
string`
  )
);
assert.ok(
  !compare(
    `1My
multiline
string`,
    `My
multiline
string`
  )
);

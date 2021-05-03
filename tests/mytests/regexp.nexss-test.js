let values = ["some1"];

module.exports = {
  nexsstests: [
    {
      title: "Should be equal",
      type: "equal",
      params: ["XXXX", /XXXX/],
    },
    {
      title: "Should not be equal",
      type: "notEqual",
      params: ["XXXX", /"test":(.*)"test"/],
    },
  ],
};

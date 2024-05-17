const templateCardElArr = [
  "{%IMAGE%}",
  "{%PRODUCTNAME%}",
  "{%ORGANIC%}",
  "{%QUANTITY%}",
  "{%PRICE%}",
  "{%ID}",
  "{%ORIGIN%}",
  "{%NUTRIENTS%}",
  "{%DESCRIPTION%}",
];
const lowerCase = templateCardElArr.map((curr) =>
  curr.toLowerCase().replaceAll("{", "").replaceAll("%", "").replaceAll("}", "")
);

module.exports = (template, product) => {
  let output = template;

  for (let i = 0; i < templateCardElArr.length; i++) {
    if (product[lowerCase[i]] || product["productName"]) {
      if (lowerCase[i] === "organic") {
        const isOrganic = product[lowerCase[i]] === true;

        output = output.replaceAll(
          templateCardElArr[i],
          isOrganic ? "" : "not-organic"
        );
      }
      output = output.replaceAll(
        templateCardElArr[i],
        product[lowerCase[i]] ?? product["productName"]
      );
    }
  }
  return output;
};

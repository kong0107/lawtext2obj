//import lawtext2obj from "./lawtext2obj.js";
lawtext2obj = require('./lawtext2obj.js');

const units = [
    {
        argv: ["滿二十歲為成年。\n"],
        expected: ["滿二十歲為成年。"]
    },
    {
        argv: ["遇有下列情形之一，其居所視為住所：\n一、住所無可考者。\n二、在我國無住所者。但依法須依住所地法者，不在此限。"],
        expected: [
            {
                text: "遇有下列情形之一，其居所視為住所：",
                children: [
                    "一、住所無可考者。",
                    "二、在我國無住所者。但依法須依住所地法者，不在此限。"
                ]
            }
        ]
    }
];

const result = units.reduce(function(prev, cur) {
    const retVal = lawtext2obj.apply(null, cur.argv);
    const isEqual = (retVal === cur.expected);
    if(!isEqual)
        console.log(
            "/******INPUT*****/\n",
            cur.argv,
            "\n/*----OUTPUT----*/\n",
            JSON.stringify(retVal, null, 2)
        );
	return (isEqual && prev);
});

console.log("Test %s.", result ? "succeeds" : "fails");

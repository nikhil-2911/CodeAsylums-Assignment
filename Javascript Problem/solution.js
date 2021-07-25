const data = [
  "Jul 11 16:11:51:490 [139681125603136] uam ST: ON",
  "Jul 11 16:11:51:490 [139681125603134] uam ST: OFF",
  "Jul 11 16:11:52:452 [139681125603178] uam ST: ON",
  "Jul 11 16:11:54:661 [139681125603136] uam ST: ERR",
  "Jul 11 16:11:55:079 [139681125603191] uam ST: ON",
  "Jul 11 16:11:55:083 [139681125603191] uam ST: ERR",
  "Jul 11 16:11:56:067 [139681125603136] uam ST: ERR",
  "Jul 11 16:11:58:500 [139681125603136] uam ST: OFF",
  "Jul 11 16:11:58:242 [139681125603191] uam ST: OFF",
  "Jul 11 16:12:10:101 [139681125603178] uam ST: OFF",
];
arr = [];
data.map((d, index) => {
  return arr.push(d.split(" "));
});
// console.log(arr);
obj = {
  timestamp: "",
  device_id: "",
  instr_code: "",
  device_status: "",
};
objList = [];
arr.map((a, index) => {
  obj = {
    timestamp: a[0] + " " + a[1] + ", " + a[2],
    device_id: a[3].slice(1, a[3].length - 1),
    instr_code: a[4],
    device_status: a[5] + " " + a[6],
  };
  return objList.push(obj);
});
let ids = new Set(objList.map((i) => i.device_id));

let printingList = [];
ids.forEach((id) => {
  let start;
  objList.map((obj) => {
    if (id === obj.device_id && obj.device_status === "ST: ON") {
      start = obj.timestamp;
    }
  });
  let end;
  objList.map((obj) => {
    if (id === obj.device_id && obj.device_status === "ST: OFF") {
      end = obj.timestamp;
    }
  });
  let duration = parseInt(parseInt(new Date(end) - new Date(start)) / 1000);
  let errors = [];
  objList.map((obj) => {
    if (id === obj.device_id && obj.device_status === "ST: ERR") {
      return errors.push(obj.timestamp);
    }
  });
  obj = {
    id: id,
    duration: duration,
    errors: errors,
  };
  printingList.push(obj);
});
printingList.map((pl) => {
  console.log(pl);
  !isNaN(pl.duration) &&
    console.log(
      "\nDevice " + pl.id + " was on for " + pl.duration + " seconds."
    );
  l = pl.errors.length === 0 ? "no" : "following";
  !isNaN(pl.duration) &&
    console.log("Device " + pl.id + " had " + l + " error events");
  !isNaN(pl.duration) &&
    pl.errors.map((e) => {
      console.log("\t" + e);
    });
});

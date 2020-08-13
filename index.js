const express = require("express");
const iw = require("./wpa_supplicant/iw");
const app = express();
const child_process = require("child_process");

app.get("/api/ssids", async (req, res) => {
  iw.scan({ iface: "wlan0", show_hidden: true }, function (err, networks) {
    if (networks) {
      const netArray = networks.map((network) => network.ssid);
      res.send(netArray);
    }
    res.send([]);
  });
});

app.post("/api/change", async (req, res) => {
  const [ssid, passphrase, interface, driver] = req.body;
  child_process.exec(
    `wpa_supplicant -B -D ${driver} -i ${interface} -c < ( wpa_passphrase ${ssid} ${passphrase} > /pi/api/temp/example.conf)`
  );

  const options = {
    interface,
    ssid,
    passphrase,
    driver,
  };

  wpa_supplicant.enable(options, function (err) {
    if (err) {
      return res.json({ status: "disconected" });
    } else {
      res.json({ status: "conected" });
    }
  });
});

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
app.listen(port, () => {
  console.log("Server listening on port " + port);
});

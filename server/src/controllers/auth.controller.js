const login = (req, res) => {
  res.status(200).json({ ok: true, route: "login" });
};

const callback = (req, res) => {
  res.status(200).json({ ok: true, route: "callback", query: req.query });
};

const logout = (req, res) => {
  res.status(200).json({ ok: true, route: "logout" });
};

module.exports = { login, callback, logout };

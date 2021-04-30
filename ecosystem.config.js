module.exports = {
  apps : [{
    name : 'gestionale cassa custom',
    script : './server/server.js',
    watch: ["server"],
    watch_delay : 1000,
    ignore_watch : ["node_modules", "server/public", "server/db"],
    //instances : "max",
    //exec_mode : "cluster"
  }],
};

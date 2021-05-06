module.exports = {
  apps : [{
    name : 'cassa',
    script : './server/server.js',
    watch: ["server"],
    watch_delay : 1000,
    ignore_watch : ["server/public"],
    //instances : "max",
    //exec_mode : "cluster"
  }],
};

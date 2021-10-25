const express = require('express');
const socket = require('socket.io');

const app = express();
var server = app.listen(80);

app.use(express.static('public'));

const io = socket(server);

var minecraftServer = []; //server list
var running_minecraftServer = []; //running server
var starting_minecraftServer = [];
const minecraftServerPath = "ServerSide/Server";
const COPYSERVERPath = "ServerSide/COPYSERVER";
const blockedFiles = [
    "server.config",
    "spigot.jar",
    "desktop.ini",
    "server.log",
    "server.properties",
    "server-icon.png",
    "spigot.yml",
    "ServerController.jar",
    //DIR
    "plugins"
];
var mc_server;

var server_data = []; //child_proc
var serverN_data = []; // server name
var port_data = []; //port

var user_data = [];

const fs = require("fs-extra");
const lineReader = require('line-reader');
// eslint-disable-next-line no-global-assign
Promise = require('bluebird');

const dirTree = require("directory-tree");

const proc = require('child_process');

io.on("connection", function (socket) {
    socket.on("test", data => {
        console.log("clientTEST", data);
    });
    console.warn("SOCKET CONNECTED " + socket.id)
    socket.emit("connected");
    socket.on("command", function (data) {
        console.log(data);
        let port = parseInt(data.split('*')[1]);
        let cmd = data.split('*')[0];
        console.log(cmd);
        console.log(port_data.indexOf(port), port_data, port);
        if (!server_data[port_data.indexOf(port)]) return;
        server_data[port_data.indexOf(port)].stdin.write(cmd + "\r");
        if (server_data[port_data.indexOf(port)]) {
            if (cmd == "stop") {
                socket.emit("statusReturn", "loading");
                delete server_data[port_data.indexOf(port)];
                delete running_minecraftServer[port_data.indexOf(port)];
                delete serverN_data[port_data.indexOf(port)]
                delete port_data[port_data.indexOf(port)];
            }
        } else {
            socket.emit('errorMessage', "Server offline!");
        }
    });
    socket.on("create", function (data) {
        minecraftServer = fs.readdirSync(minecraftServerPath);
        if (minecraftServer.length < 4 && !minecraftServer.includes(data.servername)) {
            fs.copy(`ServerSide/COPYSERVER/SERVERCHILD_${data.version}`, minecraftServerPath, function (err) {
                if (err) {
                    console.log('An error occured while copying the folder.')
                    return console.error(err)
                }
                fs.appendFileSync('ServerSide/Server/SERVERCHILD/server.log', 'ConsoleLog');
                fs.appendFileSync('ServerSide/Server/SERVERCHILD/server.config', `Version=${data.version} \n`);
                fs.appendFileSync('ServerSide/Server/SERVERCHILD/server.config', `ServerSoftware=${data.serversoftware} \n`);
                fs.appendFileSync('ServerSide/Server/SERVERCHILD/server.config', `Ram=${data.ram} \n`);
                fs.appendFileSync('ServerSide/Server/SERVERCHILD/server.config', `Player=${data.slots} \n`);
                let properties = [];
                let eachLine = Promise.promisify(lineReader.eachLine);
                eachLine(`ServerSide/Server/SERVERCHILD/server.properties`, function (line) {
                    properties.push(line);
                }).then(function (err) {
                    if (err) throw err;
                    fs.writeFileSync(`ServerSide/Server/SERVERCHILD/server.properties`, ' ');
                    properties.forEach(prop => {
                        let set;
                        prop = prop.split('=')[0];
                        switch (prop) {
                            case 'spawn-protection':
                                set = 8;
                                break;
                            case 'max-tick-time':
                                set = 60000;
                                break;
                            case 'query.port=25565':
                                set = 25565;
                                break;
                            case 'generator-settings':
                                set = ' ';
                                break;
                            case 'force-gamemode':
                                set = "false";
                                break;
                            case 'allow-nether':
                                set = "true";
                                break;
                            case 'enforce-whitelist':
                                set = "false";
                                break;
                            case 'gamemode':
                                set = "survival";
                                break;
                            case 'broadcast-console-to-ops':
                                set = "false";
                                break;
                            case 'enable-query':
                                set = "false";
                                break;
                            case 'player-idle-timeout':
                                set = 0;
                                break;
                            case 'difficulty':
                                set = "normal";
                                break;
                            case 'spawn-monsters':
                                set = "true";
                                break;
                            case 'broadcast-rcon-to-ops':
                                set = "true";
                                break;
                            case 'op-permission-level':
                                set = 4;
                                break;
                            case 'pvp':
                                set = "true";
                                break;
                            case 'snooper-enabled':
                                set = "true";
                                break;
                            case 'level-type':
                                set = "default";
                                break;
                            case 'hardcore':
                                set = "false";
                                break;
                            case 'enable-command-block':
                                set = "false";
                                break;
                            case 'max-players':
                                set = data.slots;
                                break;
                            case 'network-compression-threshold':
                                set = 256;
                                break;
                            case 'resource-pack-sha1':
                                set = " ";
                                break;
                            case 'max-world-size':
                                set = 29999984;
                                break;
                            case 'function-permission-level':
                                set = 2;
                                break;
                            case 'rcon.port':
                                set = 25575;
                                break;
                            case 'server-port':
                                set = 25565;
                                break;
                            case 'debug':
                                set = "false";
                                break;
                            case 'server-ip':
                                set = " ";
                                break;
                            case 'spawn-npcs':
                                set = "true";
                                break;
                            case 'allow-flight':
                                set = "false";
                                break;
                            case 'level-name':
                                set = "world";
                                break;
                            case 'view-distance':
                                set = 8;
                                break;
                            case 'resource-pack':
                                set = " ";
                                break;
                            case 'spawn-animals':
                                set = "true";
                                break;
                            case 'white-list':
                                set = "false";
                                break;
                            case 'rcon.password':
                                set = " ";
                                break;
                            case 'generate-structures':
                                set = "true";
                                break;
                            case 'online-mode':
                                set = "true";
                                break;
                            case 'max-build-height':
                                set = 256;
                                break;
                            case 'level-seed':
                                set = " ";
                                break;
                            case 'use-native-transport':
                                set = "true";
                                break;
                            case 'prevent-proxy-connections':
                                set = "true";
                                break;
                            case 'enable-rcon':
                                set = "true";
                                break;
                            case 'motd':
                                set = `[ONLINE]         [${data.version}]`
                        }
                        fs.appendFileSync(`ServerSide/Server/SERVERCHILD/server.properties`, `${prop}=${set}\n`);
                    });
                    fs.renameSync('ServerSide/Server/SERVERCHILD', `ServerSide/Server/${data.servername}`);
                });
            });

        } else {
            console.log("max number of servers has been reached!")
        }
    });
    socket.on("checkStatus", function (server_) {
        if (!running_minecraftServer.includes(server_.name)) {
            socket.emit("statusReturn", "offline");
        }
        const users = user_data[serverN_data.indexOf(server_)]
        socket.emit("reloadUser", users);
    });
    socket.on("checkVersions", function () {
        let versions_raw = fs.readdirSync(COPYSERVERPath);
        let versions = [];
        versions_raw.forEach(ver => {

            versions.push(ver.split('_')[1]);
        });
        socket.emit("getVersions", versions);
    });
    socket.on("checkConfig", function () {
        let config = [];
        let eachLine = Promise.promisify(lineReader.eachLine);
        eachLine(`ServerSide/DefaultConfigFile.txt`, function (line) {
            config.push(line);
        }).then(function (err) {
            if (err) throw err;
            socket.emit("getConfig", config)
        });
    });
    socket.on("runServer", function (server_) {
        socket.emit("infoMessage", "LOADING...")
        let serverSoftware;
        let ram;
        let users = [];
        minecraftServer = fs.readdirSync(minecraftServerPath);
        if (minecraftServer.includes(server_)) {
            console.log(`${server_} started!`);
            let eachLine = Promise.promisify(lineReader.eachLine);
            eachLine(`ServerSide/Server/${server_}/server.config`, function (line) {
                if (line.includes("ServerSoftware")) {
                    serverSoftware = "spigot"
                }
                if (line.includes("Ram")) {
                    ram = line.split('=')[1];
                }
            }).then(function (err) {
                if (err) throw err;
                mc_server = proc.spawn(
                    "java",
                    ['-Xms1024M', `-Xmx2000M`, '-jar', `${serverSoftware}.jar`, 'nogui'], {
                        cwd: minecraftServerPath + "/" + server_
                    }
                );
                fs.writeFile(`ServerSide/Server/${server_}/server.log`, ' ');
                lineReader.eachLine(`ServerSide/Server/${server_}/server.properties`, function (line) {
                    if (line.includes('server-port')) {
                        socket.emit("IPv4", line.split('=')[1])
                        port_data.push(parseInt(line.split('=')[1]));
                        user_data.push(users);
                        server_data.push(mc_server);
                        serverN_data.push(server_);
                    }
                    if (line.includes('max-players')) {
                        socket.emit("slots", line.split('=')[1])
                    }
                });
                socket.emit("statusReturn", "loading");
                starting_minecraftServer.push(server_);
                mc_server.stdout.on('data', function (data) {
                    if (data) {
                        fs.appendFileSync(`ServerSide/Server/${server_}/server.log`, data.toString());
                        if (data.includes("Chat")) {
                            let message = data.toString().split(':')[3];
                            let d = new Date();
                            let hour = d.getHours();
                            let min = d.getMinutes();
                            if (min < 10) {
                                min = 0 + min.toString();
                            }
                            if (hour < 10) {
                                hour = 0 + hour.toString();
                            }
                            let time = `${hour}:${min}`;
                            socket.emit("chatMessage", {
                                message: message,
                                time: time
                            });
                        } else {
                            socket.emit('write-command', data.toString());
                        }
                        if (data.includes("logged") && !data.includes('<')) {
                            let user = data.toString().split(' ')[3].split('[')[0];
                            users.push(user);
                            user_data[serverN_data.indexOf(server_)] = users;
                            socket.emit("reloadUser", users);
                        }
                        if (data.includes("left") && !data.includes('<')) {
                            let user = data.toString().split(' ')[3];
                            users = users.filter(user_ => user_ != user);
                            user_data[serverN_data.indexOf(server_)] = users;
                            socket.emit("reloadUser", users);
                        }
                        if (data.includes("Done") && !data.includes('<')) {
                            socket.emit("statusReturn", "online");
                            socket.emit("reloadUser", []);
                            starting_minecraftServer = starting_minecraftServer.filter(x => x != server_);
                            running_minecraftServer.push(server_);
                        }
                        if (data.includes("Stopping server") && !data.includes('<')) {
                            socket.emit("reloadUser", []);
                            socket.emit("statusReturn", "offline");
                        }
                        if (data.includes("**** FAILED TO BIND TO PORT!") && !data.includes('<')) {
                            socket.emit("statusReturn", "offline");
                            console.log("TEST1");
                        }
                    }
                });
                mc_server.stderr.on('data', function (data) {
                    if (data) {
                        socket.emit('write-error', data.toString());
                    }
                });
                mc_server.on('exit', function () {
                    mc_server = server = null;
                    socket.emit('status', null);
                });
            });
        } else {
            socket.emit("errorMessage", "runServer")
        }
        socket.on("disconnect", function () {
            console.log("SOCKET DISCONNECTED " + socket.id)
        });
    });
    socket.on("getFileTree", function (server) {
        socket.emit("blockedFiles", blockedFiles);
        getFileTree(server);
    });
    socket.on("getInnerFile", function (server, filePath) {
        const fileData = fs.readFileSync(filePath, {
            encoding: 'utf8'
        });
        socket.emit("innerFile", fileData);
    });
    socket.on("deleteFiles", function (server, filesToDelete) {
        let files = filesToDelete.filter(
            file => !blockedFiles.includes(file.name)
        );
        files.forEach(file => {
            if (!fs.existsSync(file.path)) return;
            if (file.type == 'directory') {
                fs.rmdirSync(file.path, {
                    recursive: true
                });
            } else {
                fs.unlinkSync(file.path);
            }
            console.log(`(${server}) ${file.name} deleted!`);
        });
        getFileTree(server);
    });
    socket.on("deleteServer", function (server) {
        if (running_minecraftServer.includes(server)) return;
        console.log(`delete ${server}`);
        fs.remove(`ServerSide/Server/${server}`).then(function (err) {
            if (err) throw err;
            console.log(`Server (${server}) deleted!`);
        });
    });
    socket.on("AllServerInfo", function () {
        minecraftServer = fs.readdirSync(minecraftServerPath);
        console.log(minecraftServer);
        let serverInfo = [];
        let serverCount = 0;
        minecraftServer = minecraftServer.filter(server_ => server_ != 'SERVERCHILD');
        minecraftServer.forEach(function (server) {
            let port_;
            let max_players;
            let version_;
            let status_;
            if (running_minecraftServer.includes(server)) {
                status_ = "online";
            } else {
                status_ = "offline";
            }
            let eachLine = Promise.promisify(lineReader.eachLine);
            eachLine(`ServerSide/Server/${server}/server.properties`, function (line) {
                if (line.includes('server-port')) {
                    port_ = line.split('=')[1];
                }
                if (line.includes('max-players')) {
                    max_players = line.split('=')[1];
                }
            }).then(function (err) {
                if (err) throw err;
                eachLine(`ServerSide/Server/${server}/server.config`, function (line) {
                    if (line.includes('Version')) {
                        version_ = line.split('=')[1];
                    }
                }).then(function (err) {
                    if (err) throw err;
                    let cur_player = [];
                    if (running_minecraftServer.includes(server)) {
                        cur_player = user_data[serverN_data.indexOf(server)];
                    }
                    serverInfo.push({
                        name: server,
                        status: status_,
                        port: port_,
                        slots: max_players,
                        player: cur_player.length,
                        version: version_
                    });
                    serverCount++;
                    if (serverCount == minecraftServer.length) {
                        socket.emit("serverListUpdate", serverInfo);
                    }
                });
            });
        });
    });
    socket.on("ServerInfo", function (server) {
        let status_;
        if (running_minecraftServer.includes(server)) {
            status_ = "online";
        } else if (starting_minecraftServer.includes(server)) {
            status_ = "loading";
        } else {
            status_ = "offline";
        }
        let port_;
        let max_players;
        let version;
        let eachLine = Promise.promisify(lineReader.eachLine);
        eachLine(`ServerSide/Server/${server}/server.properties`, function (line) {
            if (line.includes('server-port')) {
                port_ = line.split('=')[1];
            }
            if (line.includes('max-players')) {
                max_players = line.split('=')[1];
            }
        }).then(function (err) {
            if (err) throw err;
            eachLine(`ServerSide/Server/${server}/server.config`, function (line) {
                if (line.includes('Version')) {
                    version = line.split('=')[1];
                }
            }).then(function (err) {
                if (err) throw err;
                let cur_player = [];
                if (running_minecraftServer.includes(server)) {
                    cur_player = user_data[serverN_data.indexOf(server)]
                }
                socket.emit("ServerUpdate", {
                    name: server,
                    status: status_,
                    port: port_,
                    slots: max_players,
                    player: cur_player,
                    version: version
                });
            });
        });
    });
    socket.on("PlayerInfo", function (server) {
        let cur_player = [];
        if (running_minecraftServer.includes(server)) {
            cur_player = user_data[serverN_data.indexOf(server)];
        }
        socket.emit("reloadUser", cur_player);
    });
    socket.on("bannedPlayer", function (server) {
        fs.readFile(`ServerSide/Server/${server}/banned-players.json`, function (err, data) {
            if (err) throw err;
            const raw = JSON.parse(data);
            let player = [];
            raw.forEach(ban => {
                player.push({
                    name: ban.name,
                    time: ban.expires
                });
            });
            socket.emit("bannedPlayerUpdate", player);
        });
    });
    socket.on("whiteListPlayer", function (server) {
        fs.readFile(`ServerSide/Server/${server}/whitelist.json`, function (err, data) {
            if (err) throw err;
            const raw = JSON.parse(data);
            let player = [];
            raw.forEach(ban => {
                player.push({
                    name: ban.name,
                    rang: "DEFAULT"
                });
            });
            socket.emit("whiteListPlayerUpdate", player);
        });
    });
    socket.on("ReconnectToServer", function (server_) {
        reconnect(server_.name, server_.port);
    });

    function getFileTree(server) {
        let directory = [];
        dirTree(`ServerSide/Server/${server}`, null, null, (items) => {
            directory.push(items);
        });
        socket.emit("updateFileTree", directory);
    }

    function reconnect(server_) {
        console.log(starting_minecraftServer);
        if (starting_minecraftServer.includes(server_)) {
            socket.emit("statusReturn", "loading");
        }
        if (running_minecraftServer.includes(server_)) {

            socket.emit("statusReturn", "online");
        }
        if (running_minecraftServer.includes(server_) || starting_minecraftServer.includes(server_)) {
            lineReader.eachLine(`ServerSide/Server/${server_}/server.log`, function (line) {
                if (line.includes('Chat')) {
                    let message = line.toString().split(':')[3];
                    let d = new Date();
                    let hour = d.getHours();
                    let min = d.getMinutes();
                    if (min < 10) {
                        min = 0 + min.toString();
                    }
                    if (hour < 10) {
                        hour = 0 + hour.toString();
                    }
                    let time = `${hour}:${min}`;
                    socket.emit("chatMessage", {
                        message: message,
                        time: time
                    });
                } else {
                    socket.emit("write-command", line);
                }
            });
            server_data[serverN_data.indexOf(server_)].stdout.on('data', function (data) {
                if (data) {
                    if (data.includes("Chat")) {
                        let message = data.toString().split(':')[3];
                        let d = new Date();
                        let hour = d.getHours();
                        let min = d.getMinutes();
                        if (min < 10) {
                            min = 0 + min.toString();
                        }
                        if (hour < 10) {
                            hour = 0 + hour.toString();
                        }
                        let time = `${hour}:${min}`;
                        socket.emit("chatMessage", {
                            message: message,
                            time: time
                        });
                    } else {
                        socket.emit('write-command', data.toString());
                    }
                    if (data.includes("logged") && !data.includes('<')) {
                        console.log(user_data[serverN_data.indexOf[server_]]);
                        socket.emit("reloadUser", user_data[serverN_data.indexOf(server_)]);
                    }
                    if (data.includes("left") && !data.includes('<')) {
                        socket.emit("reloadUser", user_data[serverN_data.indexOf(server_)]);
                    }
                    if (data.includes("Stopping server") && !data.includes('<')) {
                        socket.emit("statusReturn", "offline");
                    }
                    if (data.includes("Done") && !data.includes('<')) {
                        socket.emit("statusReturn", "online");
                        socket.emit("reloadUser", []);
                    }
                }
            });

            server_data[serverN_data.indexOf(server_)].stderr.on('data', function (data) {
                if (data) {
                    socket.emit('write-error', data.toString());
                }
            });
        }
    }

});
const NodeMediaServer = require('node-media-server');
let argv = require('minimist')(process.argv.slice(2),
    {
        string:['rtmp_port','http_port','https_port'],
        alias: {
            'rtmp_port': 'r',
            'http_port': 'h',
            'https_port': 's',
        },
        default:{
            'rtmp_port': 1935,
            'http_port': 8000,
            'https_port': 8443,  
        }
    });

if (argv.help) {
    console.log('Usage:');
    console.log('   node-media-server --help //print help information');
    console.log('   node-media-server --rtmp_port 1935 or -r 1935');
    console.log('   node-media-server --http_port 8000 or -h 8000');
    console.log('   node-media-server --https_port 8443 or -s 8443');
    process.exit(0);
}

const config = {
    rtmp: {
        port: argv.rtmp_port,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60,
    },
    http: {
        port: 8000,
        mediaroot: 'srv/media',
        webroot: __dirname+'/www',
        allow_origin: '*',
        api: true
    },
    trans: {
        ffmpeg: '/usr/bin/ffmpeg',
        tasks: [
        {
            app: 'live',
            mp4: true,
            mp4Flags: '[movflags=faststart]',
            hls: true,
            hlsFlags: '[hls_time=2:hls_list_size_3]',
            dash: true,
            dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
        }
        ]
    },
    auth: {
        api: true,
        api_user: 'admin',
        api_pass: 'admin',
        play: true,
        publish: true,
        secret: 'dclgoethe'
    }
};

let nms = new NodeMediaServer(config);
nms.run();
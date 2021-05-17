function drag_start(event) {
    var style = window.getComputedStyle(event.target, null);
    var str = (parseInt(style.getPropertyValue("left")) - event.clientX) + ',' + (parseInt(style.getPropertyValue("top")) - event.clientY) + ',' + event.target.id;
    event.dataTransfer.setData("Text", str);
}

function drop(event) {
    var offset = event.dataTransfer.getData("Text").split(',');
    var dm = document.getElementById(offset[2]);
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
    event.preventDefault();
    return false;
}

function drag_over(event) {
    event.preventDefault();
    return false;
}

function setSystemInfo(field) {
    const el = document.getElementById(field.key)
    if (field.key === 'connection') {
        const data = navigator[field.key]
        if (data !== undefined)
            el.innerHTML = field.value + ': ' + 'Effective type-' + data.effectiveType + ', RTT-' + data.rtt + ', Downlink-' + data.downlink
        return
    }
    el.innerHTML = field.value + ': ' + navigator[field.key]

}

const inputEl = document.getElementById('terminal__prompt__cursor')
const sysInfoEl = document.getElementById('system__info')
const introEl = document.getElementById('intro')
const outputEl = document.getElementById('output')
const terminal = document.getElementById('terminal')
const denied = document.getElementById('denied')

terminal.addEventListener('click', () => {
    inputEl.focus()
})

const audios = {
    error: '../audio/src_assets_audio_error.wav',
    folder: '../audio/src_assets_audio_folder.wav',
    scan: '../audio/src_assets_audio_scan.wav',
    info: '../audio/src_assets_audio_info.wav',
    granted: '../audio/src_assets_audio_granted.wav',
    keyboard: '../audio/src_assets_audio_keyboard.wav',
    stdout: '../audio/src_assets_audio_stdout.wav',
    stdin: '../audio/src_assets_audio_stdin.wav'
}

const audio = new Audio()

const systemInfo = [
    {
        key: 'appVersion',
        value: 'App version'
    },
    {
        key: 'cookieEnabled',
        value: 'Cookie Enabled'
    },
    {
        key: 'connection',
        value: 'Connection'
    },
    {
        key: 'deviceMemory',
        value: 'Device memory'
    },
    {
        key: 'onLine',
        value: 'Online'
    },
    {
        key: 'platform',
        value: 'Platform'
    },
    {
        key: 'userAgent',
        value: 'User agent'
    }
]

setInterval(() => {
    systemInfo.forEach(info => setSystemInfo(info))
}, 1000)

const commandsData = [
    {
        command: 'help',
        data: '<div class="help"> <span>Available commands</span><table border="1"><tr><th>Command</th><th>Description</th><th>Usage</th></tr><tr><td>cd</td><td>Change directory</td><td>cd directory-name</td></tr><tr><td>ls</td><td>List all files of a directory</td><td>ls</td></tr><tr><td>pwd</td><td>Check present working directory</td><td>pwd</td></tr><tr><td>cat</td><td>Display the contents of a file</td><td>cat filename</td></tr><tr><td>clear</td><td>Clear the terminal</td><td>clear</td></tr><tr><td>help</td><td>Lists all the available commands</td><td>help</td></tr></table></div>'
    }
]

const commands = ['help', 'cd', 'ls', 'cat', 'clear', 'pwd']
const directoryStructure = [
    {
        pathName: '~',
        items: [
            {
                type: 'directory',
                item: 'About'
            },
            { type: 'directory', item: 'Work' },
            { type: 'directory', item: 'Technology' },
            { type: 'directory', item: 'Connect' }]
    },
    {
        pathName: '~/About',
        items: [
            {
                type: 'file',
                item: 'about.txt',
                content: '<p class="about">Im a freelanced fullstack developer and a passionate programmer who believes in learn by errors.</p>'
            }
        ]
    },
    {
        pathName: '~/Work',
        items: [
            {
                type: 'file',
                item: 'work.txt',
                content: '<p class="work">I work as a platform developer at <a target="_blank" href="https://thestartupreneur.co">The Startupreneur.</a></p>'
            }
        ]
    },
    {
        pathName: '~/Technology',
        items: [
            {
                type: 'file',
                item: 'technology.txt',
                content: '<p class="technology">I love to code with Vue Js. Other than Vue my favorite weapons are TypeScript and JavaScript. Most of the cases i spend time with Firebase.</p>'
            }
        ]
    },
    {
        pathName: '~/Connect',
        items: [
            {
                type: 'file',
                item: 'connect.txt',
                content: '<div class="connect"><div class="row"> <span>GitHub - </span> <a href="https://github.com/thealoneprogrammer" target="_blank" alt="thealoneprogrammer">https://github.com/thealoneprogrammer</a></div><div class="row"> <span>LinkedIn - </span> <a href="https://www.linkedin.com/in/sujith-d/" target="_blank" alt="thealoneprogrammer">https://www.linkedin.com/in/sujith-d</a></div><div class="row"> <span>Instagram - </span> <a href="https://www.instagram.com/thealoneprogrammer/" target="_blank" alt="thealoneprogrammer">https://www.instagram.com/thealoneprogrammer</a></div><div class="row"> <span>Facebook - </span> <a href="https://www.facebook.com/sujith.kulal.31" target="_blank" alt="thealoneprogrammer">https://www.facebook.com/sujith.kulal.31</a></div><div class="row"> <span>Email - </span> <a href="mailto:thealoneprogrammer@gmail.com" target="_blank" alt="thealoneprogrammer">thealoneprogrammer@gmail.com</a></div></div>'
            }
        ]
    }
]

let currentPath = "~"
updateCurrentPath()

function isValidCommad(cmd) {
    return commands.find(command => command === cmd) ? true : false
}

function preparedCommand(command) {
    return command.split(' ');
}

function changeDirectory(dir) {
    if (dir === '~' || dir === '..' || dir === undefined || dir === '') {
        currentPath = '~'
        updateCurrentPath()
        return
    }
    if (isHome()) {
        const obj = directoryStructure.find(path => path.pathName.substring(2, path.pathName.length) === dir)
        if (obj === undefined) {
            displayOutput({ command: '', data: '<span class="no__such">No such file or directory</span>' })
            return
        }
        currentPath += `/${dir}`
        updateCurrentPath()
        return
    }
    displayOutput({ command: '', data: '<span class="no__such">No such file or directory</span>' })
}

function isHome() {
    return currentPath === '~' ? true : false
}

function updateCurrentPath() {
    const curPathEls = document.getElementsByClassName('current__path')

    Array.from(curPathEls).forEach(cPath => {
        cPath.innerHTML = `${currentPath}`
    })
}

function listFileOrDirectories() {
    const obj = directoryStructure.find(item => item.pathName === currentPath)
    const el = document.createElement('div')
    el.className = 'listings'
    let spanEl = ''
    obj.items.forEach(item => {
        spanEl = document.createElement('span')
        spanEl.innerHTML = item.item
        el.appendChild(spanEl)
    })
    displayOutput({ command: '', data: el.outerHTML })
}

function displayFileContents(file) {
    if (file === undefined) {
        displayOutput(commandsData.find(cmdDt => cmdDt.command === 'help'))
        return
    }
    if (!isHome()) {
        audio.src = audios.stdout
        audio.play()
        const obj = directoryStructure.find(path => path.pathName === currentPath)
        if (obj === undefined) {
            displayOutput({ command: '', data: `<span class="no__such">No such file called ${file}</span>` })
            return
        }
        const item = obj.items.find(item => item.item === file)

        if (item === undefined) {
            displayOutput({ command: '', data: `<span class="no__such">No such file called ${file}</span>` })
            return
        }
        displayOutput({ command: '', data: item.content })
        return
    }
    displayOutput({ command: '', data: `<span class="no__such">No such file called ${file}</span>` })
}

function presentWorkingDir() {
    displayOutput({ command: '', data: `<span>${currentPath.replace('~', '/home')}</span>` })
}

function switchFolder(folder) {
    audio.src = audios.folder
    audio.play()
    clear()
    currentPath = '~'
    changeDirectory(folder)
}

function executeCommand(command) {
    const preparedCmd = preparedCommand(command)
    const isValid = isValidCommad(preparedCmd[0])
    if (isValid) {
        switch (preparedCmd[0]) {
            case 'help': displayOutput(commandsData.find(cmdDt => cmdDt.command === preparedCmd[0]));
                break;
            case 'cd': changeDirectory(preparedCmd[1])
                break;
            case 'ls': listFileOrDirectories()
                break;
            case 'cat': displayFileContents(preparedCmd[1])
                break;
            case 'clear': clear()
                break;
            case 'pwd': presentWorkingDir()
                break;
            default: executeCommand('help')
        }
        inputEl.value = ""
        return
    }
    executeCommand('help')
}

function observeKeyInput(event) {
    audio.src = audios.stdin
    audio.play()
    if (event.keyCode === 13) {
        event.preventDefault()
        clear()
        executeCommand(inputEl.value)
    }
}

inputEl.addEventListener('keyup', observeKeyInput)

function clear() {
    sysInfoEl.style.display = 'none'
    introEl.style.display = 'none'
    denied.style.display = 'none'
    outputEl.innerHTML = ''
}

function displayOutput(obj) {
    audio.src = audios.granted
    audio.play()
    clear()
    outputEl.innerHTML = obj.data
}

document.addEventListener('contextmenu', (event) => {
    event.preventDefault()
    displayError()
    return false
})

function displayError() {
    clear()
    denied.style.display = 'block'
    audio.src = audios.error
    audio.play()
}

document.onkeydown = function (e) {
    if (event.keyCode == 123) {
        displayError()
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        displayError()
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        displayError()
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        displayError()
        return false;
    }
}
